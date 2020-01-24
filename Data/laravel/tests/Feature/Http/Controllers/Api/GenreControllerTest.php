<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Models\Genre;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\TestResponse;
use Illuminate\Support\Facades\Lang;

use Tests\TestCase;

class GenreControllerTest extends TestCase
{
    use DatabaseMigrations;

    public function testIndex()
    {
        $genre = factory(Genre::class)->create();
        $response = $this->get(route('genres.index'));

        $response
            ->assertStatus(200)
            ->assertJson([$genre->toArray()]);
    }

    public function testShow()
    {
        $genre = factory(genre::class)->create();
        $response = $this->get(route('genres.show', ['genre' => $genre->id]));

        $response
            ->assertStatus(200)
            ->assertJson($genre->toArray());
    }

    public function testInvalidationData()
    {
        $response = $this->json('POST', route('genres.store'), []);
        $this->assertInvalidationRequired($response);

        $response = $this->json('POST', route('genres.store'), [
            'name' => str_repeat('a', 256),
            'is_active' => 'a'
        ]);

        $this->assertInvalidationMax($response);
    }

    public function testInvalidationDataUpdate()
    {
        $genre = factory(genre::class)->create();
        $response = $this->json('PUT', route('genres.update', ['genre' => $genre->id]));
        $this->assertInvalidationRequired($response);

        $response = $this->json('PUT', route('genres.update', ['genre' => $genre->id]), [
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

    public function testStore()
    {
        $response = $this->json(
            'POST',
            route('genres.store'),
            [
                'name' => 'test'
            ]
        );
        $id = $response->json('id');
        $genre = genre::find($id);

        $response
            ->assertStatus(201)
            ->assertJson($genre->toArray());
        $this->assertTrue($response->json('is_active'));

        $response = $this->json(
            'POST',
            route('genres.store'),
            [
                'name' => 'test',
                'is_active' => false
            ]
        );

        $response
            ->assertJsonFragment([
                'is_active' => false
            ]);
    }

    public function testUpdate()
    {
        $genre = factory(genre::class)->create([
            'is_active' => false,
            'name' => 'test'
        ]);
        $response = $this->json(
            'PUT',
            route('genres.update', ['genre' => $genre->id]),
            [
                'is_active' => true,
                'name' => 'changed_test'
            ]
        );
        $id = $response->json('id');
        $genre = genre::find($id);

        $response
            ->assertStatus(200)
            ->assertJson($genre->toArray())
            ->assertJsonFragment(([
                'is_active' => true,
                'name' => 'changed_test'
            ]));
        $response = $this->json(
            'POST',
            route('genres.store'),
            [
                'name' => 'test',
                'is_active' => false
            ]
        );

        $response
            ->assertJsonFragment([
                'is_active' => false
            ]);
    }

    public function testDestroy()
    {
        $genre = factory(genre::class)->create();
        $response = $this->json(
            'DELETE',
            route(
                'genres.destroy',
                ['genre' => $genre->id]
            )
        );
        $response->assertStatus(204);
        $this->assertNull(genre::find($genre->id));
        $this->assertNotNull(genre::withTrashed()->find($genre->id));
    }
}
