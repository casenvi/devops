<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use PhpParser\Node\Stmt\TryCatch;

class Video extends Model
{
    use SoftDeletes, Traits\Uuid;

    const RATTING = [
        'free',
        '+10',
        '+12',
        '+14',
        '+16',
        '+18'
    ];

    protected $fillable = [
        'title',
        'description',
        'year_launched',
        'duration',
        'opened',
        'rating'
    ];
    protected $dates = [
        'deleted_at'
    ];
    protected $casts = [
        'title' => 'string',
        'year_launched' => 'smallInteger',
        'duration' => 'smallInteger',
        'opened' => 'boolean',
        'rating' => 'string'
    ];
    public $incrementing = false;

    public static function create(array $att = [])
    {
        try {
            \DB::beginTransaction();
            $obj = static::query()->create($att);
            static::handleRelations($obj, $att);
            //Uploads here
            \DB::commit();
            return $obj;
        } catch (\Exception $e) {
            if (isset($obj)){
                // Delete files
            }
            \DB::rollBack();
            throw $e;
        }
    }

    public function update(array $att = [], $options = [])
    {
        try {
            \DB::beginTransaction();
            $saved = parent::update($att, $options);
            static::handleRelations($this, $att);
            if ($saved){
                //Uploads here
                // delete old files
            }
            \DB::commit();
            return $saved;
        } catch (\Exception $e) {
            if (isset($saved)) {
                // Delete files
            }
            \DB::rollBack();
            throw $e;
        }        
    }

    protected static function handleRelations(Video $video, array $att)
    {
        if (isset($att['categories_id'])){
            $video->categories()->sync($att['categories_id']);
        }
        if (isset($att['genres_id'])){
            $video->genres()->sync($att['genres_id']);
        }
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class)->withTrashed();
    }

    public function genres()
    {
        return $this->belongsToMany(Genre::class)->withTrashed();
    }
}
