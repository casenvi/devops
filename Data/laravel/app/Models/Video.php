<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

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

    public function categories()
    {
        return $this->belongsToMany(Category::class)->withTrashed();
    }

    public function genres()
    {
        return $this->belongsToMany(Genre::class)->withTrashed();
    }
}
