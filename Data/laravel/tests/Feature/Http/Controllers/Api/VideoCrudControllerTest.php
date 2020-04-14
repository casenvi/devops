<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Http\Resources\VideoResource;
use App\Models\Category;
use App\Models\Genre;
use App\Models\Video;
use Tests\Traits\TestResource;
use Tests\Traits\TestSaves;
use Tests\Traits\TestValidations;

class VideoCrudControllerTest extends VideoBaseControllerTest
{
  use TestValidations, TestSaves, TestResource;

  private $serializedFields = [
    'id',
    'title',
    'rating',
    'created_at',
    'year_launched',
    'duration',
    'categories',
    'genres',
    'video_file_url',
    'thumb_file_url',
    'banner_file_url',
    'trailer_file_url',
    'opened',
    'updated_at',
    'deleted_at'
  ];

  protected function setUp(): void
  {
    parent::setUp();
  }

  public function testIndex()
  {
    $response = $this->get(route('video.index'));
    $response
      ->assertStatus(200)
      ->assertJson([
        'meta' => ['per_page' => 15]
      ])
      ->assertJsonStructure([
        'data' => [
          '*' => $this->serializedFields
        ],
        'links' => [],
        'meta'  => [],
      ]);

    $resource = VideoResource::collection(collect([$this->video]));

    $this->assertResource($response, $resource);   
  }

  public function testShow()
  {
    $response = $this->get(route('video.show', ['video' => $this->video->id]));
    $response
      ->assertStatus(200)
      ->assertJsonStructure([
        'data' => $this->serializedFields
      ]);
    $id = $response->json('data.id');
    $resource = new VideoResource(Video::find($id));
    $this->assertResource($response, $resource);
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

  public function testStoreWithOutFiles()
  {
    $categoryId = factory(Category::class)->create()->id;
    $genre = factory(Genre::class)->create();
    $genre->categories()->sync($categoryId);
    $genreId = $genre->id;
    $response = $this->assertStore($this->sendData + [
      'categories_id' => [$categoryId],
      'genres_id' => [$genreId]
    ], $this->sendData);
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

  public function testSyncCategories()
  {
    $categoriesId =  factory(Category::class, 3)->create()->pluck('id')->toArray();
    $genre = factory(Genre::class)->create();
    $genre->categories()->sync($categoriesId);
    $genreId = $genre->id;

    $sendData = [
      'title' => 'teste_1',
      'rating' => 'free',
      'year_launched' => 1985,
      'duration' => 2,
      'opened' => false
    ];

    $response = $this->json(
      'POST',
      $this->routeStore(),
      $sendData + [
        'genres_id' => [$genreId],
        'categories_id' => [$categoriesId[0]],
      ]
    );
    $this->assertHasCategory($response->json('id'), $categoriesId[0]);

    $response = $this->json(
      'PUT',
      route('video.update', ['video' => $response->json('id')]),
      $sendData + [
        'genres_id' => [$genreId],
        'categories_id' => [$categoriesId[1], $categoriesId[2]],
      ]
    );

    $this->assertMissingHasCategory($response->json('id'), $categoriesId[0]);
    $this->assertHasCategory($response->json('id'), $categoriesId[1]);
    $this->assertHasCategory($response->json('id'), $categoriesId[2]);
  }

  public function testSyncGenres()
  {
    $genres =  factory(Genre::class, 3)->create();
    $genresId = $genres->pluck('id')->toArray();
    $categoryId = factory(Category::class)->create()->id;
    $genres->each(function ($genre) use ($categoryId) {
      $genre->categories()->sync($categoryId);
    });

    $sendData = [
      'title' => 'teste_1',
      'rating' => 'free',
      'year_launched' => 1985,
      'duration' => 2,
      'opened' => false
    ];

    $response = $this->json(
      'POST',
      $this->routeStore(),
      $sendData + [
        'genres_id' => [$genresId[0]],
        'categories_id' => [$categoryId],
      ]
    );
    $this->assertHasGenre($response->json('id'), $genresId[0]);

    $response = $this->json(
      'PUT',
      route('video.update', ['video' => $response->json('id')]),
      $sendData + [
        'genres_id' => [$genresId[1], $genresId[2]],
        'categories_id' => [$categoryId],
      ]
    );

    $this->assertMissingHasGenre($response->json('id'), $genresId[0]);
    $this->assertHasGenre($response->json('id'), $genresId[1]);
    $this->assertHasGenre($response->json('id'), $genresId[2]);
  }
}
