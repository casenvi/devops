<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BasicCrudController;
use App\Models\CastMember;
use App\Models\Category;

class CastMemberController extends BasicCrudController
{
  protected $rules = [
    'name' => 'required|max:255|min:3',
   // 'type' => 'required',
    'is_active' => 'boolean'
  ];

  protected function model()
  {
    return CastMember::class;
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
