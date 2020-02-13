<?php

# Classe especifica                 vendor/bin/phpunit tests/Feature/Http/Controllers/Api/CategoryControllerTest.php
# Método especifico em um arquivo   vendor/bin/phpunit --filter testIndex tests/Feature/Http/Controllers/Api/CategoryControllerTest.php
# Método especifico em uma classe   vendor/bin/phpunit --filter CategoryTest::testIndex

namespace Tests\Feature\Http\Controllers\Api;

use App\Models\Category;

use Illuminate\Foundation\Testing\DatabaseMigrations;

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
        $this->assertInvalidationInStoreAction($data, 'required');
        $this->assertInvalidationInUpdateAction($data, 'required');

        $data = [
            'name' => str_repeat('a', 256)
        ];
        $this->assertInvalidationInStoreAction($data, 'validation.max.string', ['max' => 255]);
        $this->assertInvalidationInUpdateAction($data, 'validation.max.string', ['max' => 255]);

        $data = [
            'name' => false
        ];
        $this->assertInvalidationInStoreAction($data, 'validation.min.string', ['min' => 3]);
        $this->assertInvalidationInUpdateAction($data, 'validation.min.string', ['min' => 3]);

        $data = [
            'is_active' => 'a'
        ];
        $this->assertInvalidationInStoreAction(
            $data,
            'validation.boolean'
        );
    }

    public function testDestroy()
    {
        $response = $this->json(
            'DELETE',
            route(
                'categories.destroy',
                ['category' => $this->category->id]
            )
        );
        $response->assertStatus(204);
        $this->assertNull($this->category::find($this->category->id));
        $this->assertNotNull($this->category::withTrashed()->find($this->category->id));
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
