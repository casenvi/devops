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
                'required'
            ],
            'opened' => [
                'boolean'
            ],
            'rating' => [
                'required',
                'in:' . implode (',', Video::RATTING)
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
