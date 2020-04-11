<?php

namespace Tests\Feature\Models;

use App\Models\Category;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class CategoryTest extends TestCase
{
    use DatabaseMigrations;
    
    public function testList()
    {
        factory(Category::class, 1)->create();
        $categories = Category::all();
        $this->assertCount(1, $categories);
        $categoryKey = array_keys($categories->first()->getAttributes());
        $this->assertEqualsCanonicalizing(
            [
                'id',
                'name',
                'description', 
                'created_at', 
                'updated_at', 
                'deleted_at', 
                'is_active'
            ], 
            $categoryKey);
    }

    public function testCreate()
    {
        $category = Category::create([
            'name' => 'teste_1'
        ]);
        $category->refresh();
        $this->assertEquals(36, strlen($category->id));
        $this->assertEquals('teste_1', $category->name);
        $this->assertNull($category->description);
        $this->assertTrue($category->is_active);
    }

    public function testCreateDescription()
    {
        $category = Category::create([
            'name' => 'teste_1',
            'description' => null
        ]);
        $category->refresh();
        $this->assertNull($category->description);

        $category = Category::create([
            'name' => 'teste_1',
            'description' => 'test_description'
        ]);
        $category->refresh();
        $this->assertEquals('test_description', $category->description);
    }

    public function testCreateIsActive()
    {
        $category = Category::create([
            'name' => 'teste_1',
            'is_active' => false
        ]);
        $category->refresh();
        $this->assertFalse($category->is_active);

        $category = Category::create([
            'name' => 'teste_1',
            'is_active' => true
        ]);
        $category->refresh();
        $this->assertTrue($category->is_active);
    }

    // UPDATES

     public function testUpdate()
    {
        $category = factory(Category::class)->create([
            'description' => 'test_description',
            'is_active' => false
        ]);
        $data = [
            'description' => 'changed_description',
            'is_active' => true
        ];        
        $category->update($data);
        foreach($data as $key => $value){
            $this->assertEquals($value, $category->{$key});
        }
    } 
    
    // DELETE
    public function testDelete()
    {
        $category = factory(Category::class)->create();
        $category->delete();
        $this->assertNull(Category::find($category->id));
        $category->restore();
        $this->assertNotNull(Category::find($category->id));
    }
}
