<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\VideoResource;
use App\Models\Video;
use App\Rules\GenreHasCategoriesRule;
use Illuminate\Database\Eloquent\Builder;
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
            'description' => [
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
            'cast_members_id' => [
                'required',
                'array',
                'exists:cast_members,id,deleted_at,NULL'
            ],
            'video_file' => [
                'nullable',
                'mimetypes:video/mp4',
                'max:' . Video::VIDEO_FILE_MAX_SIZE
            ],
            'thumb_file' => [
                'nullable',
                'image',
                'max:' . Video::THUMB_FILE_MAX_SIZE
            ],
            'banner_file' => [
                'nullable',
                'image',
                'max:' . Video::BANNER_FILE_MAX_SIZE
            ],
            'trailer_file' => [
                'nullable',
                'mimetypes:video/mp4',
                'max:' . Video::TRAILER_FILE_MAX_SIZE
            ]

        ];
    }

    public function store(Request $request)
    {
        $this->addRuleIfGenreHasCategory($request);
        $validatedData = $this->validate($request, $this->rulesStore());
        $obj = $this->model()::create($validatedData);
        $obj->refresh();
        return $obj;
    }

    public function update(Request $request, $id)
    {
        $obj = $this->findOrFail($id);
        $this->addRuleIfGenreHasCategory($request);
        $validatedData = $this->validate(
            $request, 
            $request->isMethod('PUT') ? $this->rulesUpdate(): $this->rulesPatch() 
        );
        $obj->update($validatedData);
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

    protected function resource()
    {
        return VideoResource::class;
    }

    protected function resourceCollection()
    {
        return $this->resource();
    }

    protected function queryBuilder(): Builder
    {
        $action = \Route::getCurrentRoute()->getAction()['uses'];
        return parent::queryBuilder()->with([
            strpos($action, 'index') !== false
                ? 'genres'
                : 'genres.categories',
            'categories',
            'castMembers'
        ]);
    }

    protected function rulesPatch()
    {
        return array_map(function($rules){
            if (is_array($rules)){
                $exists = in_array("required", $rules);
                if ($exists){
                    array_unshift($rules, "sometimes");
                }
            }else{
                return str_replace("required", "sometimes|required", $rules);
            }
            return $rules;
        }, $this->rulesUpdate());
    }
}
