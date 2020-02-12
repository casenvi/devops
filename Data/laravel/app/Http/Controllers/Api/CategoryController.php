<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BasicCrudController;
use App\Models\Category;

class CategoryController extends BasicCrudController
{
    protected $rules = [
        'name' => 'required|max:255|min:3',
        'decription' => 'nullable',
        'is_active' => 'boolean'
    ];

    protected function model()
    {
        return Category::class;
    }
    protected function rulesStore()
    {
        return $this->rules;
    }

    protected function rulesUpdate()
    {
        return $this->rules;
    }
}
