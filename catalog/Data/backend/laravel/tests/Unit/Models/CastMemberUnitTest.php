<?php

namespace Tests\Unit\Models;

use App\Models\CastMember;
use App\Models\Traits\Uuid;
use EloquentFilter\Filterable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Tests\TestCase;

class CastMemberUnitTest extends TestCase
{

  private $castMember;

  protected function setUp(): void
  {
    parent::setUp();
    $this->castMember = new CastMember();
  }

  public function testIfUseTraits()
  {
    $traits = [
      SoftDeletes::class,
      Uuid::class,
      Filterable::class
    ];
    $castMemberTraits = array_keys(class_uses(CastMember::class));
    $this->assertEquals($traits, $castMemberTraits);
  }

  public function testFillableAttribute()
  {
    $fillable = ['name', 'type', 'is_active'];
    $this->assertEquals($fillable, $this->castMember->getFillable());
  }

  public function testDatesAttribute()
  {
    $dates = [
      'deleted_at',
      'created_at',
      'updated_at'
    ];
    $this->assertEqualsCanonicalizing($dates, $this->castMember->getDates());
    $this->assertCount(count($dates), $this->castMember->getDates());
  }

  public function testCastsAttribute()
  {
    $casts = ['id' => 'string', 'type' => 'smallInteger', 'is_active' => 'boolean'];
    $this->assertEquals($casts, $this->castMember->getCasts());
  }

  public function testIncrementingAttribute()
  {
    $this->assertFalse($this->castMember->incrementing);
  }
}
