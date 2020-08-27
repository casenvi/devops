<?php

# Classe especifica                 vendor/bin/phpunit tests/Feature/Http/Controllers/Api/CategoryControllerTest.php
# Método especifico em um arquivo   vendor/bin/phpunit --filter testIndex tests/Feature/Http/Controllers/Api/CategoryControllerTest.php
# Método especifico em uma classe   vendor/bin/phpunit --filter CategoryTest::testIndex

namespace Tests\Feature\Http\Controllers\Api;

use App\Models\Category;
use App\Http\Resources\CategoryResource;

use Illuminate\Foundation\Testing\DatabaseMigrations;

use Tests\TestCase;
use Tests\Traits\TestSaves;
use Tests\Traits\TestValidations;
use Tests\Traits\TestResource;

class CategoryControllerTest extends TestCase
{
    use DatabaseMigrations, TestValidations, TestSaves, TestResource;

    private $category;

    private $serializedFields = [
        'id',
        'name',
        'description',
        'is_active',
        'created_at',
        'updated_at',
        'deleted_at'
    ];

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
        $resource = CategoryResource::collection(collect([$this->category]));

        $this->assertResource($response, $resource);

    }

    public function testShow()
    {
        $response = $this->get(route('categories.show', ['category' => $this->category->id]));
        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'data' => $this->serializedFields
            ]);
        $id = $response->json('data.id');
        $resource = new CategoryResource(Category::find($id));

        $this->assertResource($response, $resource);
    }

    public function testStore()
    {
        $data = [
            'name' => 'test'
        ];
        $response = $this->assertStore($data, $data + ['description' => null, 'is_active' => true, 'deleted_at' => null]);
        $response->assertJsonStructure([
            'data' => $this->serializedFields
        ]);
        
        $id = $response->json('data.id');
        $resource = new CategoryResource(Category::find($id));
        $this->assertResource($response, $resource);
    }

    public function  testInvalidationData()
    {
        $data = [];
        $this->assertInvalidationInStoreAction($data, 'required');
        $this->assertInvalidationInUpdateAction($data, 'required');

        $data = [
            'name' => str_repeat('a', 256)
        ];
        $this->assertInvalidationInStoreAction($data, 'max.string', ['max' => 255]);
        $this->assertInvalidationInUpdateAction($data, 'max.string', ['max' => 255]);

        $data = [
            'name' => false
        ];
        $this->assertInvalidationInStoreAction($data, 'min.string', ['min' => 3]);
        $this->assertInvalidationInUpdateAction($data, 'min.string', ['min' => 3]);

        $data = [
            'is_active' => 'a'
        ];
        $this->assertInvalidationInStoreAction(
            $data,
            'boolean'
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

    public function testUpdate()
    {        
        $data = [
            'name' => 'test',
            'description' => 'test',
            'is_active' => true
        ];
        $response = $this->assertUpdate($data, $data + ['deleted_at' => null]);
        $response->assertJsonStructure([
            'data' => $this->serializedFields
        ]);
        $id = $response->json('data.id');
        $resource = new CategoryResource(Category::find($id));
        $this->assertResource($response, $resource);

        $data['description'] = 'test1';
        $response = $this->assertUpdate($data, array_merge($data + ['description' => 'test1']));

        $data['description'] = null;
        $response = $this->assertUpdate($data, array_merge($data + ['description' => null]));
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
