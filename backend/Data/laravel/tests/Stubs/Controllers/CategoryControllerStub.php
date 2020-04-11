<?php

namespace Tests\Stubs\Controllers;

use App\Http\Controllers\Api\BasicCrudController;
use Tests\Stubs\Models\CategoryStub;
use App\Http\Resources\CategoryResource;  

class CategoryControllerStub extends BasicCrudController
{
  protected function model()
  {
    return CategoryStub::class;
  }
  protected $rules = [
    'name' => 'required|max:255',
    'decription' => 'nullable'
  ];

  protected function rulesStore()
  {
    return $this->rules;
  }

  protected function rulesUpdate()
  {
    return $this->rules;
  }

  protected function resource()
  {
    return CategoryResource::class;
  }

  protected function resourceCollection()
  {
    return $this->resource();
  }
}
