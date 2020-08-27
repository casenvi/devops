<?php

namespace Tests\Feature\Models;

use App\Models\CastMember;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class CastMemberTest extends TestCase
{
  use DatabaseMigrations;

  public function testList()
  {
    factory(CastMember::class, 1)->create();
    $castMembers = CastMember::all();
    $this->assertCount(1, $castMembers);
    $castMemberKey = array_keys($castMembers->first()->getAttributes());
    $this->assertEqualsCanonicalizing(
      [
        'id',
        'name',
        'type',
        'created_at',
        'updated_at',
        'deleted_at',
        'is_active'
      ],
      $castMemberKey
    );
  }

  public function testCreate()
  {
    $castMember = CastMember::create([
      'name' => 'teste_1',
      'type' => 1
    ]);
    $castMember->refresh();
    $this->assertEquals(36, strlen($castMember->id));
    $this->assertEquals('teste_1', $castMember->name);
    $this->assertEquals(1, $castMember->type);
    $this->assertTrue($castMember->is_active);
  }

  public function testCreateIsActive()
  {
    $castMember = CastMember::create([
      'name' => 'teste_1',
      'type' => 2,
      'is_active' => false
    ]);
    $castMember->refresh();
    $this->assertFalse($castMember->is_active);

    $castMember = CastMember::create([
      'name' => 'teste_1',
      'type' => 2,
      'is_active' => true
    ]);
    $castMember->refresh();
    $this->assertTrue($castMember->is_active);
  }

  // UPDATES

  public function testUpdate()
  {
    $castMember = factory(CastMember::class)->create([
      'type' => 2,
      'is_active' => false
    ]);
    $data = [
      'type' => 1,
      'is_active' => true
    ];
    $castMember->update($data);
    foreach ($data as $key => $value) {
      $this->assertEquals($value, $castMember->{$key});
    }
  }

  // DELETE
  public function testDelete()
  {
    $castMember = factory(CastMember::class)->create();
    $castMember->delete();
    $this->assertNull(CastMember::find($castMember->id));
    $castMember->restore();
    $this->assertNotNull(CastMember::find($castMember->id));
  }
}
