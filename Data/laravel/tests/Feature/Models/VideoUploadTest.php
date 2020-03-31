<?php

namespace Tests\Feature\Models;

use App\Models\Video;
use Illuminate\Http\UploadedFile;
use Tests\Exceptions\TestException;
use Illuminate\Database\Events\TransactionCommitted;

class VideoUploadTest extends VideoBaseTest
{
  private $fileFields = [];

  protected function setUp():void
  {
    parent::setUp();
    foreach (Video::$fileFields as $field) {
      $this->fileFields[$field] = "$field.test";
    }
  }

  public function testCreateWithBasicsFields()
  {    
    $video = Video::create($this->data + $this->fileFields);

    $video->refresh();

    $this->assertEquals(36, strlen($video->id));
    $this->assertFalse($video->opened);
    $this->assertDatabaseHas(
      'videos',
      $this->data + $this->fileFields + ['opened' => false]
    );

    $video = Video::create($this->data + ['opened' => true]);
    $this->assertTrue($video->opened);
    $this->assertDatabaseHas('videos', $this->data + ['opened' => true]);
  }

  public function testUpdateWithBasicsFields()
  {
    $video = factory(Video::class)->create($this->data + $this->fileFields + [
      'opened' => false
    ]);

    $video->update($this->data);
    $this->assertFalse($video->opened);
    $this->assertDatabaseHas('videos', $this->data + $this->fileFields  + ['opened' => false]);

    $video = factory(Video::class)->create(
      ['opened' => false]
    );

    $video->update($this->data + $this->fileFields  + ['opened' => true]);
    $this->assertTrue($video->opened);

    $this->assertDatabaseHas('videos', $this->data + $this->fileFields  + ['opened' => true]);
  }

  public function testCreatedWithFiles()
  {

    \Storage::fake();

    $video = Video::create(
      $this->data + [
        'thumb_file' =>  UploadedFile::fake()->image("thumb.jpeg"),
        'video_file' =>  UploadedFile::fake()->image("video.mp4"),
      ]
    );
    \Storage::assertExists("{$video->id}/{$video->thumb_file}");
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
