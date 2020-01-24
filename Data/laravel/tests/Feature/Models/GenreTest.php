<?php

namespace Tests\Feature\Models;

use App\Models\Genre;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class GenreTest extends TestCase
{
   use DatabaseMigrations;
    
    public function testList()
    {
        factory(Genre::class, 1)->create();
        $Genres = Genre::all();
        $this->assertCount(1, $Genres);
        $GenreKey = array_keys($Genres->first()->getAttributes());
        $this->assertEqualsCanonicalizing(
            [
                'id',
                'name',
                'created_at', 
                'updated_at', 
                'deleted_at', 
                'is_active'
            ], 
            $GenreKey);
    }

    public function testCreate()
    {
        $Genre = Genre::create([
            'name' => 'teste_1'
        ]);
        $Genre->refresh();
        $this->assertEquals(36, strlen($Genre->id));
        $this->assertEquals('teste_1', $Genre->name);
        $this->assertTrue($Genre->is_active);
    }
    

    public function testCreateIsActive()
    {
        $Genre = Genre::create([
            'name' => 'teste_1',
            'is_active' => false
        ]);
        $Genre->refresh();
        $this->assertFalse($Genre->is_active);

        $Genre = Genre::create([
            'name' => 'teste_1',
            'is_active' => true
        ]);
        $Genre->refresh();
        $this->assertTrue($Genre->is_active);
    }

    // UPDATES

     public function testUpdate()
    {
        $Genre = factory(Genre::class)->create([
            'name' => 'test_name',
            'is_active' => false
        ]);
        $data = [
            'name' => 'changed_name',
            'is_active' => true
        ];        
        $Genre->update($data);
        foreach($data as $key => $value){
            $this->assertEquals($value, $Genre->{$key});
        }
    } 
    
    // DELETE
    public function testDelete()
    {
        $Genre = factory(Genre::class)->create();
        $Genre->delete();
        $this->assertNull(Genre::find($Genre->id));
        $Genre->restore();
        $this->assertNotNull(Genre::find($Genre->id));
    }
}
