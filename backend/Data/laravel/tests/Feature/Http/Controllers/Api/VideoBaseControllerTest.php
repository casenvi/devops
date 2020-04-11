<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Models\Video;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\TestResponse;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;
use Tests\Traits\TestUploads;

abstract class VideoBaseControllerTest extends TestCase
{
  use DatabaseMigrations, TestUploads;

  protected $video;

  protected $sendData;

  protected function setUp(): void
  {
    parent::setUp();
    $this->video = factory(Video::class)->create();
    $this->sendData = [
      'title' => 'teste_1',
      'rating' => 'free',
      'year_launched' => 1985,
      'duration' => 2,
      'opened' => false
    ];
  }

  /************* Protected functions ********************************* */

  protected function assertIfFileUrlExists(Video $video, TestResponse $response)
  {

    $fileFields = Video::$fileFields;

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
        'video_file' => UploadedFile::fake()->create('video_file.mp4'),
        'thumb_file' => UploadedFile::fake()->create('thumb_file.jpg'),
        'banner_file' => UploadedFile::fake()->create('banner_file.jpg'),
        'trailer_file' => UploadedFile::fake()->create('trailer_file.mp4')
      ];
  }
}
