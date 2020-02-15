<?php

# Classe especifica                 vendor/bin/phpunit tests/Feature/Http/Controllers/Api/CastMemberControllerTest.php
# Método especifico em um arquivo   vendor/bin/phpunit --filter testIndex tests/Feature/Http/Controllers/Api/CastMemberControllerTest.php
# Método especifico em uma classe   vendor/bin/phpunit --filter CastMemberTest::testIndex

namespace Tests\Feature\Http\Controllers\Api;

use App\Models\CastMember;

use Illuminate\Foundation\Testing\DatabaseMigrations;

use Tests\TestCase;
use Tests\Traits\TestSaves;
use Tests\Traits\TestValidations;

class CastMemberControllerTest extends TestCase
{
  use DatabaseMigrations, TestValidations, TestSaves;

  private $castMember;

  protected function setUp(): void
  {
    parent::setUp();
    $this->castMember = factory(CastMember::class)->create([
      'type' => CastMember::TYPE_DIRECTOR
    ]);
  }

  public function testIndex()
  {
    $response = $this->get(route('cast_members.index'));
    $response
      ->assertStatus(200)
      ->assertJson([$this->castMember->toArray()]);
  }

  public function testShow()
  {
    $response = $this->get(route('cast_members.show', ['cast_member' => $this->castMember->id]));
    $response
      ->assertStatus(200)
      ->assertJson($this->castMember->toArray());
  }

  public function testStore()
  {
    $data = [
      'name' => 'test',
      'type' => CastMember::TYPE_DIRECTOR
    ];
    $this->assertStore($data, $data + ['is_active' => true]);
  }

  public function  testInvalidationData()
  {
    $data = [];
    $this->assertInvalidationInStoreAction($data, 'required');
    $this->assertInvalidationInUpdateAction($data, 'required');

    $data = [
      'name' => str_repeat('a', 256),
    ];
    $this->assertInvalidationInStoreAction($data, 'max.string', ['max' => 255]);
    $this->assertInvalidationInUpdateAction($data, 'max.string', ['max' => 255]);

    $data = [
      'name' => false,
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
  }
  

  public function testDestroy()
  {
    $response = $this->json(
      'DELETE',
      route(
        'cast_members.destroy',
        ['cast_member' => $this->castMember->id]
      )
    );
    $response->assertStatus(204);
    $this->assertNull($this->castMember::find($this->castMember->id));
    $this->assertNotNull($this->castMember::withTrashed()->find($this->castMember->id));
  }

  protected function model()
  {
    return CastMember::class;
  }

  protected function routeStore()
  {
    return route('cast_members.store');
  }

  protected function routeUpdate()
  {
    return route('cast_members.update', ['cast_member' => $this->castMember->id]);
  }
}
