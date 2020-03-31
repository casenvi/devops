<?php

namespace Tests\Feature\Models;

use App\Models\Video;
use Illuminate\Http\UploadedFile;
use Tests\Exceptions\TestException;
use Illuminate\Database\Events\TransactionCommitted;
use Illuminate\Foundation\Testing\WithFaker;

class VideoUploadTest extends VideoBaseTest
{
  public function testCreatedWithFiles()
  {

    \Storage::fake();

    $video = Video::create(

      $this->data + [
        'video_file' =>  UploadedFile::fake()->create("video.mp4")
      ]
    );

    \Storage::assertExists("{$video->id}/{$video->video_file}");
  }

  public function testCreateIfRollbackFiles()
  {
    \Storage::fake();

    \Event::listen(TransactionCommitted::class, function () {

      throw new TestException();
    });

    $hasError = false;

    try {
      $video = Video::create(
        $this->data + [
          'video_file' =>  UploadedFile::fake()->create("video.mp4")
        ]
      );
    } catch (TestException $e) {
      $this->assertCount(0, \Storage::allFiles());
      $hasError = true;
    }

    $this->assertTrue($hasError);
  }

  public function testUpdateIfRollbackFiles()
  {
    \Storage::fake();

    $video = factory(Video::class)->create();

    \Event::listen(TransactionCommitted::class, function () {

      throw new TestException();
    });

    $hasError = false;

    try {
      $video->update(

        $this->data + [
          'video_file' =>  UploadedFile::fake()->create("video.mp4")
        ]
      );
    } catch (TestException $e) {
      $this->assertCount(0, \Storage::allFiles());
      $hasError = true;
    }

    $this->assertTrue($hasError);
  }

  public function testFileUrlsIfNullWhenFiledAreNull()
  {
    $video = factory(Video::class)->create();

    foreach (Video::$fileFields as $field) {

      $fileUrl = $video->{"{$field}_url"};

      $this->assertNull($fileUrl);
    }
  }
}
