<?php

// TODO: Create category relationship with genre
// TODO: Update genre CRUD to add the categories relationship
// TODO: Update genre controller test to check it categoriies relationship
// TODO: Create video relationship with category 
// TODO: Create video relationship with genre
// TODO: Create video validation between category and genre

namespace Tests\Feature\Http\Controllers\Api;

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
    $data = [
      'title' => 'teste_1',
      'rating' => 'free',
      'year_launched' => 1985,
      'duration' => 2,
      'opened' => false
    ];
    $this->assertStore($data, $data);
  }

  public function  testInvalidationData()
  {
    $data = [];
    $this->assertInvalidationInStoreAction($data, 'required');
    $this->assertInvalidationInUpdateAction($data, 'required');

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
        )
      ),
      'duration' => array(
          'required' => array(
            'value' => [
              'title' => 'teste',
              'year_launched' => 1985,
              'rating' => 'free',
              'duration' => 'teste'
            ],
            'ruleParams' => []
          )
        )
    );
    foreach ($data_attribute as $attribute) {
      foreach ($attribute as $key => $value) {
        $this->assertInvalidationInStoreAction($value['value'], $key, $value['ruleParams']);
        $this->assertInvalidationInUpdateAction($value['value'], $key, $value['ruleParams']);
      }
    }
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
