<?php

namespace Tests\Feature\Http\Controllers\Api;

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
        $data = [
            'name' => 'test'
        ];
        $this->assertStore($data, $data + ['is_active' => true]);
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
                'genres.destroy',
                ['genre' => $this->genre->id]
            )
        );
        $response->assertStatus(204);
        $this->assertNull($this->genre::find($this->genre->id));
        $this->assertNotNull($this->genre::withTrashed()->find($this->genre->id));
    }

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
