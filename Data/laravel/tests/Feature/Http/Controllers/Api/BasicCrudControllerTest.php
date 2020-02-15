<?php

namespace Tests\Feature\Http\Controllers\Api;

use Tests\Stubs\Models\CategoryStub;
use Tests\Stubs\Controllers\CategoryControllerStub;

use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class BasicCrudControllerTest extends TestCase
{
    private $controller;

    protected function setUp(): void
    {
        parent::setUp();
        CategoryStub::dropTable();
        CategoryStub::createTable();
        $this->controller = new CategoryControllerStub();
    }

    protected function tearDown(): void
    {
        CategoryStub::dropTable();
        parent::tearDown();
    }

    public function testIndex()
    {
        $category = CategoryStub::create([
            'name' => 'name_test',
            'description' => 'description_teste'
        ]);
        $result = $this->controller->index()->toArray();
        $this->assertEquals([$category->toArray()], $result);
    }

    public function testInvalidationDataInStore()
    {
        $this->expectException(ValidationException::class);

        $request = \Mockery::mock(Request::class);
        $request
            ->shouldReceive('all')
            ->once()
            ->andReturn(['name'=>'']);
        $this->controller->store($request);
    }

    public function testStore()
    {
        $request = \Mockery::mock(Request::class);
        $request
            ->shouldReceive('all')
            ->once()
            ->andReturn([
                'name' => 'teste_name',
                'description' => 'description_teste']);
        $obj = $this->controller->store($request);
        $this->assertEquals(
            CategoryStub::find(1)->toArray(),
            $obj->toArray()
        );
    }

    public function testShow()
    {
        $category = CategoryStub::create([
            'name' => 'teste_name',
            'description' => 'description_teste'
        ]);
        $result = $this->controller->show($category->id);
        $this->assertEquals( 
            $result->toArray(), 
            CategoryStub::find(1)->toArray()
        );
    }

    public function testUpdate()
    {
        $category = CategoryStub::create([
            'name' => 'teste_name',
            'description' => 'description_teste'
        ]);
        $request = \Mockery::mock(Request::class);
        $request
            ->shouldReceive('all')
            ->once()
            ->andReturn([
                'name' => 'teste_name_changed',
                'description' => 'description_teste_changed'
            ]);
        $result = $this->controller->update($request, $category->id);        
        $this->assertEquals(
            CategoryStub::find(1)->toArray(),
            $result->toArray()
        );
    }

    public function testDestroy()
    {
        $category = CategoryStub::create([
            'name' => 'teste_name',
            'description' => 'description_teste'
        ]);
        $result = $this->controller->destroy($category->id);
        $this->createTestResponse($result)
            ->assertStatus(204);
        $this->assertCount(0, CategoryStub::all());
    }
}
