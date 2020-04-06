<?php

// TODO: Update genre CRUD to add the categories relationship
// TODO: Update genre controller test to check it categoriies relationship0
// TODO: Create video validation between category and genre

namespace Tests\Feature\Http\Controllers\Api;

use App\Models\Category;
use App\Models\Genre;
use App\Models\Video;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\TestResponse;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;
use Tests\Traits\TestSaves;
use Tests\Traits\TestUploads;
use Tests\Traits\TestValidations;

class VideoControllerTest extends TestCase
{
  use DatabaseMigrations, TestValidations, TestSaves, TestUploads;

  private $video;

  private $sendData = [
    'title' => 'teste_1',
    'rating' => 'free',
    'year_launched' => 1985,
    'duration' => 2,
    'opened' => false
  ];

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

  public function testInvalidationVideoField()
  {

    $this->assertInvalidationFile(
      'video_file',
      'mp4',
      Video::VIDEO_FILE_MAX_SIZE,
      'mimetypes',
      ['values' => 'video/mp4']
    );
  }

  public function testStoreWithFiles()
  {
    $categoryId = factory(Category::class)->create()->id;
    $genre = factory(Genre::class)->create();
    $genre->categories()->sync($categoryId);
    $genreId = $genre->id;
    \Storage::fake();
    $files = $this->getFiles();
    $response = $this->json(
      'POST',
      $this->routeStore(),
      $this->sendData + [
        'categories_id' => [$categoryId],
        'genres_id' => [$genreId]
      ] +
        $files
    );

    $response->assertStatus(201);

    $this->assertFilesOnPersist($response,  $files);

    $video = Video::find($response->json('id'));

    $this->assertIfFileUrlExists($video, $response);
  }


  /************* Protected functions ********************************* */

  protected function assertIfFileUrlExists(Video $video, TestResponse $response)
  {

    $fileFields = Video::$fileFields;

    $data = $response->json('id');

    foreach ($fileFields as $field) {

      $file = $video->{$field};

      \Storage::assertExists($video->relativeFilePath($file));
    }
  }

  protected function assertFilesOnPersist(TestResponse $response, $files)
  {
    $id = $response->json('id') ?? $response->json('data.id');

    $video = Video::find($id);
    $this->assertFilesExistsInStorage($video, $files);
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

  protected function assertMissingHasCategory($videoID, $categoryID)
  {
    $this->assertDatabaseMissing('category_video', [
      'video_id' => $videoID,
      'category_id' => $categoryID
    ]);
  }

  protected function assertMissingHasGenre($videoID, $genreId)
  {
    $this->assertDatabaseMissing('genre_video', [
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
  protected function getFiles()
  {
    return
      [
        'video_file' => UploadedFile::fake()->create('video_file.mp4')
      ];
  }
}
