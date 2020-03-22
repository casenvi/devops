<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Models\Category;
use App\Models\Genre;

use Illuminate\Foundation\Testing\DatabaseMigrations;

use Tests\TestCase;
use Tests\Traits\TestSaves;
use Tests\Traits\TestValidations;

class GenreControllerTest extends TestCase
{
    use DatabaseMigrations, TestValidations, TestSaves;

    private $genre;

    protected function setUp(): void
    {
        parent::setUp();
        $this->genre = factory(Genre::class)->create();
    }

    public function testIndex()
    {
        $response = $this->get(route('genres.index'));

        $response
            ->assertStatus(200)
            ->assertJson([$this->genre->toArray()]);
    }

    public function testShow()
    {
        $response = $this->get(route('genres.show', ['genre' => $this->genre->id]));
        $response
            ->assertStatus(200)
            ->assertJson($this->genre->toArray());
    }

    public function testStore()
    {
        $categoryID = factory(Category::class)->create()->id; // para criar a categoria e fazer o teste se ela existe
        $data = [
            'name' => 'test'
        ];
        $response = $this->assertStore($data + ['categories_id' => [$categoryID]], $data + ['is_active' => true]);

        $this->assertHasCategory($response->json('id'), $categoryID);
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
        $this->assertInvalidationInStoreAction($data,'boolean');
        $this->assertInvalidationInUpdateAction($data, 'boolean');

        $data = [
            'categories_id' => 'a'
        ];
        $this->assertInvalidationInStoreAction($data, 'array');
        $this->assertInvalidationInUpdateAction($data, 'array');

        $data = [
            'categories_id' => [100]
        ];
        $this->assertInvalidationInStoreAction($data, 'exists');
        $this->assertInvalidationInUpdateAction($data, 'exists');

        $category = factory(Category::class)->create(); // para criar a categoria e fazer o teste se ela existe
        $category->delete();

        $data = [
            'categories_id' => [$category->id]
        ];
        $this->assertInvalidationInStoreAction($data, 'exists');
        $this->assertInvalidationInUpdateAction($data, 'exists');

    }

    public function testDestroy()
    {
        $response = $this->json(
            'DELETE',
            route(
                'genres.destroy',
                ['genre' => $this->genre->id]
            )
        );
        $response->assertStatus(204);
        $this->assertNull($this->genre::find($this->genre->id));
        $this->assertNotNull($this->genre::withTrashed()->find($this->genre->id));
    }

    protected function assertHasCategory($genreID, $categoryID)
    {
        $this->assertDatabaseHas('category_genre', [
            'genre_id' => $genreID,
            'category_id' => $categoryID
        ]);
    }

    /*public function testSyncCategories(){
        $categoriesID = factory(Category::class, 3)->create()->pluck('id')->toArray();

        $sendData = [
            'name' => 'teste',
            'categories_id' => [$categoriesID[0]]
        ];
    }/**/

    protected function model()
    {
        return Genre::class;
    }

    protected function routeStore()
    {
        return route('genres.store');
    }

    protected function routeUpdate()
    {
        return route('genres.update', ['genre' => $this->genre->id]);
    }
}
