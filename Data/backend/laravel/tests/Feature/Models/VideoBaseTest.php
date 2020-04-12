<?php

namespace Tests\Feature\Models;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

abstract class VideoBaseTest extends TestCase
{
  use DatabaseMigrations;

  protected $data;

  protected function setUp():void
  {
    parent::setUp();
    $this->data = [
      'title' => 'teste_1',
      'rating' => 'free',
      'year_launched' => 1985,
      'duration' => 2,

    ]; 
  }


  public function assertHasCategory($videoId, $categoryId)
  {

    $this->assertDatabaseHas(
      'category_video',
      [
        'video_id' => $videoId,
        'category_id' => $categoryId
      ]
    );
  }

  public function assertHasGenre($videoId, $genreId)
  {

    $this->assertDatabaseHas(
      'genre_video',
      [
        'video_id' => $videoId,
        'genre_id' => $genreId
      ]
    );
  }

  public function assertMissingHasCategory($videoId, $categoryId)
  {

    $this->assertDatabaseMissing(
      'category_video',
      [
        'video_id' => $videoId,
        'category_id' => $categoryId
      ]
    );
  }

  public function assertMissingHasGenre($videoId, $genreId)
  {

    $this->assertDatabaseMissing(
      'genre_video',
      [
        'video_id' => $videoId,
        'genre_id' => $genreId
      ]
    );
  }
}
