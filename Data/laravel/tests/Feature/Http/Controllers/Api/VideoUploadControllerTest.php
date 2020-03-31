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

class VideoUploadControllerTest extends VideoBaseControllerTest
{
  use DatabaseMigrations, TestValidations, TestSaves, TestUploads;

  protected function setUp(): void
  {
    parent::setUp();
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
}
