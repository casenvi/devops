<?php

namespace Tests\Unit\Models;

use App\Models\Genre;
use App\Models\Traits\Uuid;
use EloquentFilter\Filterable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Tests\TestCase;

class GenreUnitTest extends TestCase
{
  private $genre;

  protected function setUp(): void
  {
    parent::setUp();
    $this->genre = new genre();
  }

  public function testIfUseTraits()
  {
    $traits = [
      SoftDeletes::class,
      Uuid::class,
      Filterable::class
    ];
    $genreTraits = array_keys(class_uses(genre::class));
    $this->assertEquals($traits, $genreTraits);
  }

  public function testFillableAttribute()
  {
    $fillable = ['name', 'is_active'];
    $this->assertEquals($fillable, $this->genre->getFillable());
  }

  public function testDatesAttribute()
  {
    $dates = [
      'deleted_at',
      'created_at',
      'updated_at'
    ];
    $this->assertEqualsCanonicalizing($dates, $this->genre->getDates());
    $this->assertCount(count($dates), $this->genre->getDates());
  }

  public function testCastsAttribute()
  {
    $casts = ['id' => 'string', 'is_active' => 'boolean'];
    $this->assertEquals($casts, $this->genre->getCasts());
  }

  public function testIncrementingAttribute()
  {
    $this->assertFalse($this->genre->incrementing);
  }
}
