<?php

namespace Tests\Unit\Models;

use App\Models\Traits\UploadFiles;
use App\Models\Video;
use App\Models\Traits\Uuid;

use Illuminate\Database\Eloquent\SoftDeletes;
use Tests\TestCase;

class VideoUnitTest extends TestCase
{
  private $video;

  protected function setUp(): void
  {
    parent::setUp();
    $this->video = new video();
  }

  public function testIfUseTraits()
  {
    $traits = [
      SoftDeletes::class,
      Uuid::class,
      UploadFiles::class
    ];
    $videoTraits = array_keys(class_uses(video::class));
    $this->assertEquals($traits, $videoTraits);
  }

  public function testFillableAttribute()
  {
    $fillable = [
      'title',
      'description',
      'year_launched',
      'duration',
      'opened',
      'rating',
      'video_file',
      'thumb_file',
      'banner_file',
      'trailer_file'
    ];
    $this->assertEquals($fillable, $this->video->getFillable());
  }

  public function testDatesAttribute()
  {
    $dates = [
      'deleted_at',
      'created_at',
      'updated_at'
    ];
    $this->assertEqualsCanonicalizing($dates, $this->video->getDates());
    $this->assertCount(count($dates), $this->video->getDates());
  }

  public function testCastsAttribute()
  {
    $casts = [
      'title' => 'string',
      'year_launched' => 'smallInteger',
      'duration' => 'smallInteger',
      'opened' => 'boolean',
      'rating' => 'string'
    ];
    $this->assertEquals($casts, $this->video->getCasts());
  }

  public function testIncrementingAttribute()
  {
    $this->assertFalse($this->video->incrementing);
  }
}