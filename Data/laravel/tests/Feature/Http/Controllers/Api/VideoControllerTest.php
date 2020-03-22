<?php

// TODO: Update genre CRUD to add the categories relationship
// TODO: Update genre controller test to check it categoriies relationship0
// TODO: Create video validation between category and genre

namespace Tests\Feature\Http\Controllers\Api;

use App\Models\Category;
use App\Models\Genre;
use App\Models\Video;

use Illuminate\Foundation\Testing\DatabaseMigrations;

use Tests\TestCase;
use Tests\Traits\TestSaves;
use Tests\Traits\TestValidations;

class VideoControllerTest extends TestCase
{
  use DatabaseMigrations, TestValidations, TestSaves;

  private $video;

  protected function setUp(): void
  {
    parent::setUp();
    $this->video = factory(Video::class)->create();
  }

  public function testIndex()
  {
    $response = $this->get(route('video.index'));
    $response
      ->assertStatus(200)
      ->assertJson([$this->video->toArray()]);
  }

  public function testShow()
  {
    $response = $this->get(route('video.show', ['video' => $this->video->id]));
    $response
      ->assertStatus(200)
      ->assertJson($this->video->toArray());
  }

  public function testDestroy()
  {
    $response = $this->json(
      'DELETE',
      route(
        'video.destroy',
        ['video' => $this->video->id]
      )
    );
    $response->assertStatus(204);
    $this->assertNull($this->video::find($this->video->id));
    $this->assertNotNull($this->video::withTrashed()->find($this->video->id));
  }

  public function testStore()
  {
    $categoryId = factory(Category::class)->create()->id;
    $genreId = factory(Genre::class)->create()->id;
    $data = [
      'title' => 'teste_1',
      'rating' => 'free',
      'year_launched' => 1985,
      'duration' => 2,
      'opened' => false
    ];
    $response = $this->assertStore($data + [
      'categories_id' => [$categoryId],
      'genres_id' => [$genreId]
    ], $data);
    $this->assertHasCategory($response->json('id'), $categoryId);
    $this->assertHasGenre($response->json('id'), $genreId);
  }

  public function  testInvalidationData()
  {
    $data = [];
    $this->assertInvalidationInStoreAction($data, 'required');
    $this->assertInvalidationInUpdateAction($data, 'required');

    $category = factory(Category::class)->create(); 
    $category->delete();

    $genre = factory(Genre::class)->create(); 
    $genre->delete();

    $data_attribute = array(
      'title' => array(
        'max.string' => array(
          'value' => [
            'title' => str_repeat('a', 256),
          ],
          'ruleParams' => [
            'max' => 255
          ]
        ),
        'min.string' => array(
          'value' => [
            'title' => '12'
          ],
          'ruleParams' => [
            'min' => 3
          ]
        )
      ),
      'opened' => array(
        'boolean' => array(
          'value' => [
            'opened' => 'a'
          ],
          'ruleParams' => []
        )
      ),
      'rating' => array(
        'in' => array(
          'value' => [
            'rating' => 3
          ],
          'ruleParams' => Video::RATTING
        ),
      ),
      'categories_id' => array(
        'exists' => array(
          'value' => [
            'categories_id' => [100]
          ],
          'ruleParams' => []
        ),
      ),
      'categories_id' => array(
        'exists' => array(
          'value' => [
            'categories_id' => [$category->id]
          ],
          'ruleParams' => []
        ),
      ),
      'genres_id' => array(
        'exists' => array(
          'value' => [
            'genres_id' => [100]
          ],
          'ruleParams' => []
        ),
      ),
      'genres_id' => array(
        'exists' => array(
          'value' => [
            'genres_id' => [$genre->id]
          ],
          'ruleParams' => []
        ),
      ),

    );
    foreach ($data_attribute as $attribute) {
      foreach ($attribute as $key => $value) {
        $this->assertInvalidationInStoreAction($value['value'], $key, $value['ruleParams']);
        $this->assertInvalidationInUpdateAction($value['value'], $key, $value['ruleParams']);
      }
    }
  }

  protected function assertHasCategory($videoID, $categoryID)
  {
    $this->assertDatabaseHas('category_video', [
      'video_id' => $videoID,
      'category_id' => $categoryID
    ]);
  }

  protected function assertHasGenre($videoID, $genreId)
  {
    $this->assertDatabaseHas('genre_video', [
      'video_id' => $videoID,
      'genre_id' => $genreId
    ]);
  }
  protected function model()
  {
    return Video::class;
  }

  protected function routeStore()
  {
    return route('video.store');
  }

  protected function routeUpdate()
  {
    return route('video.update', ['video' => $this->video->id]);
  }
}
