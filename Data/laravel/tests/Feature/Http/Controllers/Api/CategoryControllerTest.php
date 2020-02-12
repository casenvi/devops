<?php

# Classe especifica                 vendor/bin/phpunit tests/Feature/Http/Controllers/Api/CategoryControllerTest.php
# Método especifico em um arquivo   vendor/bin/phpunit --filter testIndex tests/Feature/Http/Controllers/Api/CategoryControllerTest.php
# Método especifico em uma classe   vendor/bin/phpunit --filter CategoryTest::testIndex

namespace Tests\Feature\Http\Controllers\Api;

use App\Models\Category;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\TestResponse;

use Tests\TestCase;
use Tests\Traits\TestSaves;
use Tests\Traits\TestValidations;

class CategoryControllerTest extends TestCase
{
    use DatabaseMigrations, TestValidations, TestSaves;

    private $category;

    protected function setUp(): void
    {
        parent::setUp();
        $this->category = factory(Category::class)->create();
    }

    public function testIndex()
    {        
        $response = $this->get(route('categories.index'));

        $response
            ->assertStatus(200)
            ->assertJson([$this->category->toArray()]);
    }

    public function testShow()
    {
        $response = $this->get(route('categories.show', ['category' => $this->category->id]));
        $response
            ->assertStatus(200)
            ->assertJson($this->category->toArray());
    }

    public function testStore()
    {
        $data = [
            'name' => 'test'
        ];
        $this->assertStore($data, $data + ['description' => null, 'is_active' => true]);
    }

    public function  testInvalidationData()
    {
        $data = [];
        $this->assertInvalidationInStoreAction($data,'required');
        $this->assertInvalidationInUpdateAction($data, 'required');
        
        $data = [
            'name' => str_repeat('a', 256)
        ];
        $this->assertInvalidationInStoreAction($data,'validation.max.string',[ 'max' => 255]);
        $this->assertInvalidationInUpdateAction($data, 'validation.max.string', ['max' => 255]);

        $data = [
            'name' => false
        ];
        $this->assertInvalidationInStoreAction($data,'validation.min.string',['min' => 3]);
        $this->assertInvalidationInUpdateAction($data, 'validation.min.string', ['min' => 3]);

        $data = [
            'name' => str_repeat('a', 26),
            'is_active' => 'a'
        ];
        /*$this->assertInvalidationInStoreAction(
            $data,
            'validation.boolean'
        );*/       
    }

    
    protected function model()
    {
        return Category::class;
    }

    protected function routeStore()
    {
        return route('categories.store');
    }

    protected function routeUpdate()
    {
        return route('categories.update', ['category' => $this->category->id]);
    }
}
/*
ublic function testInvalidationData()
    {
        $response = $this->json('POST', route('categories.store'), []);
        $this->assertInvalidationRequired($response);

        $response = $this->json('POST', route('categories.store'),[
            'name' => str_repeat('a', 256),
            'is_active' => 'a'
        ]);

        $this->assertInvalidationMax($response);
    }

    public function testInvalidationDataUpdate()
    {
        $category = factory(Category::class)->create();
        $response = $this->json('PUT', route('categories.update', ['category' => $category->id]));
        $this->assertInvalidationRequired($response);

        $response = $this->json('PUT', route('categories.update', ['category' => $category->id]),[
            'name' => str_repeat('a', 256),
            'is_active' => 'a'
        ]);
        
        $this->assertInvalidationMax($response);
        
    }

    private function assertInvalidationMax(TestResponse $response)
    {
        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'is_active'])
            ->assertJsonFragment([
                \Lang::get('validation.max.string', ['attribute' => 'name', 'max' => 255])
            ])
            ->assertJsonFragment([
                \Lang::get('validation.boolean', ['attribute' => 'is active'])
            ]);
    }

    private function assertInvalidationRequired(TestResponse $response)
    {
        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(['name'])
            ->assertJsonMissingValidationErrors(['is active'])
            ->assertJsonFragment([
                \Lang::get('validation.required', ['attribute' => 'name'])
            ]);
    }
    */