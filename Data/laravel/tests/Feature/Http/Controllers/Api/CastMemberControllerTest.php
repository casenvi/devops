<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Http\Resources\CastMemberResource;
use App\Models\CastMember;

use Illuminate\Foundation\Testing\DatabaseMigrations;

use Tests\TestCase;
use Tests\Traits\TestResource;
use Tests\Traits\TestSaves;
use Tests\Traits\TestValidations;

class CastMemberControllerTest extends TestCase
{
  use DatabaseMigrations, TestValidations, TestSaves, TestResource;

  private $castMember;

  private $serializedFields = [
    'id',
    'name',
    'type',
    'created_at',
    'updated_at',
    'deleted_at'
  ];

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
      ->assertJson([
        'meta' => ['per_page' => 15]
      ])
      ->assertJsonStructure([
        'data' => [
          '*' => $this->serializedFields
        ],
        'links' => [],
        'meta'  => [],
      ]);

    $resource = CastMemberResource::collection(collect([$this->castMember]));

    $this->assertResource($response, $resource);    
  }

  public function testShow()
  {
    $response = $this->get(route('cast_members.show', ['cast_member' => $this->castMember->id]));
    $response
      ->assertStatus(200)
      ->assertJsonStructure([
        'data' => $this->serializedFields
      ]);
    $id = $response->json('data.id');
    $resource = new CastMemberResource(CastMember::find($id));
    $this->assertResource($response, $resource);
  }

  public function testStore()
  {
    $data = [
      [
        'name' => 'test',
        'type' => CastMember::TYPE_DIRECTOR
      ],
      [
        'name' => 'test',
        'type' => CastMember::TYPE_ACTOR
      ]
    ];
    foreach ($data as $value) {
      $response = $this->assertStore($value, $value + ['deleted_at' => null]);
      $response->assertJsonStructure([
        'data' => $this->serializedFields
      ]);
      $id = $response->json('data.id');
      $resource = new CastMemberResource(CastMember::find($id));
      $this->assertResource($response, $resource);
    }

  }

  public function testUpdate()
  {

    factory(CastMember::class)->create([
      'type' => CastMember::TYPE_DIRECTOR
    ]);
    $data = [
      'name' => 'test',
      'type' => CastMember::TYPE_ACTOR
    ];
    $response = $this->assertUpdate($data, $data + ['deleted_at' => null]);
    $response->assertJsonStructure([
      'data' => $this->serializedFields
    ]);
    $id = $response->json('data.id');
    $resource = new CastMemberResource(CastMember::find($id));
    $this->assertResource($response, $resource);
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
