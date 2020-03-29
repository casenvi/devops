<?php

namespace App\Http\Controllers\Api;

use App\Models\Video;
use App\Rules\GenreHasCategoriesRule;
use Illuminate\Http\Request;

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
                'exists:categories,id,deleted_at,NULL'
            ],
            'genres_id' => [
                'required',
                'array',
                'exists:genres,id,deleted_at,NULL'
            ],
        ];
    }

    public function store(Request $request)
    {
        $this->addRuleIfGenreHasCategory($request);
        $validatedData = $this->validate($request, $this->rulesStore());
        $self = $this;
        $obj = \DB::transaction(function () use ($self, $request, $validatedData) {
            $obj = $this->model()::create($validatedData);
            $self->handleRelations($obj, $request);
            return $obj;
        });
        $obj->refresh();
        return $obj;
    }

    public function update(Request $request, $id)
    {
        $obj = $this->findOrFail($id);
        $this->addRuleIfGenreHasCategory($request);
        $validatedData = $this->validate($request, $this->rulesUpdate());
        $self = $this;
        \DB::transaction(function () use ($self, $request, $obj, $validatedData) {
            $obj->update($validatedData);
            $self->handleRelations($obj, $request);
        });
        return $obj;
    }

    protected function addRuleIfGenreHasCategory(Request $request)
    {
        $categoriesId = $request->get('categories_id');
        $categoriesId = is_array($categoriesId) ? $categoriesId : [];
        $this->rules['genres_id'][] = new GenreHasCategoriesRule(
            $categoriesId
        );
    }

    protected function handleRelations($video, Request $request)
    {
        $video->categories()->sync($request->get('categories_id'));
        $video->genres()->sync($request->get('genres_id'));
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
