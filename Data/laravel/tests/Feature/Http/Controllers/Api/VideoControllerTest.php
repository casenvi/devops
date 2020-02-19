<?php

// TODO: Create category relationship with genre
// TODO: Update genre CRUD to add the categories relationship
// TODO: Update genre controller test to check it categoriies relationship
// TODO: Create video relationship with category 
// TODO: Create video relationship with genre
// TODO: Create video validation between category and genre

namespace Tests\Feature\Http\Controllers\Api;

use App\Models\Video;

use Illuminate\Foundation\Testing\DatabaseMigrations;

use Tests\TestCase;
use Tests\Traits\TestSaves;
use Tests\Traits\TestValidations;

class VideoControllerTest extends TestCase
{
  use DatabaseMigrations, TestValidations, TestSaves;

  private $video;

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

  public function testStore()
  {
    $data = [
      'title' => 'teste_1',
      'rating' => 'free',
      'year_launched' => 1985,
      'duration' => 2,
      'opened' => false
    ];
    $this->assertStore($data, $data);
  }/*

  public function  testInvalidationData()
  {
    $data = [];
    $this->assertInvalidationInStoreAction($data, 'required');
    $this->assertInvalidationInUpdateAction($data, 'required');

    $data = [
      'title' => str_repeat('a', 256),
    ];
    $this->assertInvalidationInStoreAction($data, 'max.string', ['max' => 255]);
    $this->assertInvalidationInUpdateAction($data, 'max.string', ['max' => 255]);

    $data = [
      'title' => false,
    ];
    $this->assertInvalidationInStoreAction($data, 'min.string', ['min' => 3]);
    $this->assertInvalidationInUpdateAction($data, 'min.string', ['min' => 3]);

    $data = [
      'is_active' => 'a'
    ];
    $this->assertInvalidationInStoreAction($data, 'boolean', []);
    $this->assertInvalidationInUpdateAction($data, 'boolean', []);

    $data = [
      'type' => '3'
    ];

    $this->assertInvalidationInStoreAction($data, 'in', [], []);
    $this->assertInvalidationInUpdateAction($data, 'in', [], []);
  }/**/

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
}
