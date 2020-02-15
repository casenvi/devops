<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BasicCrudController;
use App\Models\CastMember;

class CastMemberController extends BasicCrudController
{
  protected $rules;

  public function __construct()
  {
    $this->rules = [
      'name' => [
        'required',
        'max:255',
        'min:3'
      ],
      'type' => [
        'required',
        'in:' . implode(',' ,[CastMember::TYPE_ACTOR . ',' . CastMember::TYPE_DIRECTOR])

      ],
      'is_active' => 'boolean'
    ];
  }

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
