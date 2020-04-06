<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Models\Category;
use App\Models\Genre;
use App\Models\Video;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;

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

  public function testInvalidationThumbField()
  {

    $this->assertInvalidationFile(
      'thumb_file',
      'mp4',
      Video::THUMB_FILE_MAX_SIZE,
      'image'
    );
  }

  public function testInvalidationBannerField()
  {

    $this->assertInvalidationFile(
      'banner_file',
      'mp4',
      Video::BANNER_FILE_MAX_SIZE,
      'image'
    );
  }

  public function testInvalidationTrailerField()
  {

    $this->assertInvalidationFile(
      'trailer_file',
      'mp4',
      Video::TRAILER_FILE_MAX_SIZE,
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

  public function testUpdateWithFiles()
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
    $newFiles = [
      'thumb_file' => UploadedFile::fake()->create('thumb_file1.jpg'),
      'video_file' => UploadedFile::fake()->create('video_file1.mp4'),
      'banner_file' => UploadedFile::fake()->create('banner_file1.jpg'),
      'trailer_file' => UploadedFile::fake()->create('trailer_file1.mp4'),
    ];
    $response = $this->json(
      'PUT',
      $this->routeUpdate(),
      $this->sendData + [
        'categories_id' => [$categoryId],
        'genres_id' => [$genreId]
      ] +
        $newFiles
    );

    $response->assertStatus(200);

    $this->assertFilesOnPersist(
      $response,
      Arr::except($files, ['thumb_file', 'video_file', 'banner_file', 'trailer_file'])  + $newFiles

    );

    $id = $response->json('id');

    $video = Video::find($id);

    \Storage::assertMissing($video->relativeFilePath($files['video_file']->hashName()));
    \Storage::assertMissing($video->relativeFilePath($files['thumb_file']->hashName()));
    \Storage::assertMissing($video->relativeFilePath($files['banner_file']->hashName()));
    \Storage::assertMissing($video->relativeFilePath($files['trailer_file']->hashName()));
  }
}
