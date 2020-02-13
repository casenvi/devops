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
    $this->castMember = factory(CastMember::class)->create();
  }

  public function testIndex()
  {
    $response = $this->get(route('castmembers.index'));
    $response
      ->assertStatus(200)
      ->assertJson([$this->castMember->toArray()]);
  }

  public function testShow()
  {
    $response = $this->get(route('castmembers.show', ['castmember' => $this->castMember->id]));
    $response
      ->assertStatus(200)
      ->assertJson($this->castMember->toArray());
  }

  public function testStore()
  {
    $data = [
      'name' => 'test',
      'type' => 2
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
     // 'type' => 2
    ];
    $this->assertInvalidationInStoreAction($data, 'validation.max.string', ['max' => 255]);
    $this->assertInvalidationInUpdateAction($data, 'validation.max.string', ['max' => 255]);

    $data = [
      'name' => false,
      'type' => 2
    ];
    $this->assertInvalidationInStoreAction($data, 'validation.min.string', ['min' => 3]);
    $this->assertInvalidationInUpdateAction($data, 'validation.min.string', ['min' => 3]);

    $data = [
      'type' => 1,
      'is_active' => 'a'
    ];
    $this->assertInvalidationInStoreAction($data,'validation.boolean');
    $this->assertInvalidationInUpdateAction($data, 'validation.boolean');

    $data = [
      'type' => false,
    ];
    $this->assertInvalidationInStoreAction($data, 'required');
    $this->assertInvalidationInUpdateAction($data, 'required');


  }

  public function testDestroy()
  {
    $response = $this->json(
      'DELETE',
      route(
        'castmembers.destroy',
        ['castMember' => $this->castMember->id]
      )
    );
    $response->assertStatus(204);
    $this->assertNull($this->castMember::find($this->castMember->id));
    $this->assertNotNull($this->castMember::withTrashed()->find($this->castMember->id));
  }/* */

  protected function model()
  {
    return CastMember::class;
  }

  protected function routeStore()
  {
    return route('castmembers.store');
  }

  protected function routeUpdate()
  {
    return route('castmembers.update', ['castmember' => $this->castMember->id]);
  }
}
