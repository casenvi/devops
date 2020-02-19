<?php

namespace Tests\Feature\Models;

use App\Models\Video;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class VideoTest extends TestCase
{
  use DatabaseMigrations;

  public function testList()
  {
    factory(Video::class, 1)->create();
    $videos = Video::all();
    $this->assertCount(1, $videos);
    $videoKey = array_keys($videos->first()->getAttributes());
    $this->assertEqualsCanonicalizing(
      [
        'id',
        'title',
        'description',
        'year_launched',
        'duration',
        'opened',
        'rating',
        'created_at',
        'updated_at',
        'deleted_at'
      ],
      $videoKey
    );
  }

  public function testCreate()
  {
    $video = Video::create([
      'title' => 'teste_1',
      'rating' => 'free',
      'year_launched' => 1985,
      'duration' => 2,

    ]);
    $video->refresh();
    $this->assertEquals(36, strlen($video->id));
    $this->assertEquals('teste_1', $video->title);
    $this->assertEquals('free', $video->rating);
    $this->assertEquals(1985, $video->year_launched);
    $this->assertEquals(2, $video->duration);
    $this->assertFalse($video->opened);
  }

  public function testCreateOpened()
  {
    $video = Video::create([
      'title' => 'teste_1',
      'rating' => 'free',
      'year_launched' => 1985,
      'duration' => 2,
      'opened' => false
    ]);
    $video->refresh();
    $this->assertFalse($video->opened);

    $video = Video::create([
      'title' => 'teste_1',
      'rating' => 'free',
      'year_launched' => 1985,
      'duration' => 2,
      'opened' => true
    ]);
    $video->refresh();
    $this->assertTrue($video->opened);
  }

  // UPDATES

  public function testUpdate()
  {
    $video = factory(Video::class)->create([
      'title' => 'teste_1',
      'rating' => 'free',
      'year_launched' => 1985,
      'duration' => 2,
      'opened' => false
    ]);
    $data = [
      'title' => 'teste_changed',
      'rating' => '+18',
      'year_launched' => 1989,
      'duration' => 20,
      'opened' => true
    ];
    $video->update($data);
    foreach ($data as $key => $value) {
      $this->assertEquals($value, $video->{$key});
    }
  }

  // DELETE
  public function testDelete()
  {
    $video = factory(Video::class)->create();
    $video->delete();
    $this->assertNull(Video::find($video->id));
    $video->restore();
    $this->assertNotNull(Video::find($video->id));
  }
}
