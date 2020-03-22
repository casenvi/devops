<?php

namespace App\Http\Controllers\Api;

use App\Models\Video;

class VideoController extends BasicCrudController
{
    protected $rules;

    public function __construct()
    {
        $this->rules = [
            'title' => [
                'required',
                'max:255',
                'min:3'
            ],
            'decription' => [
                'nullable'
            ],
            'year_launched' => [
                'required',
                'date_format:Y'
            ],
            'duration' => [
                'required',
                int
            ],
            'opened' => [
                'boolean'
            ],
            'rating' => [
                'required',
                'in:' . implode(',', Video::RATTING)
            ],
            'categories_id' => [
                'required',
                'array',
                'exists:categories,id,deleted_at,null'
            ],
            'genres_id' => [
                'required',
                'array',
                'exists:genres,id,deleted_at,null'
            ]
        ];
    }

    protected function model()
    {
        return Video::class;
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
