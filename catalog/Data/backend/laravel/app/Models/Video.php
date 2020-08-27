<?php

namespace App\Models;

use App\Models\Traits\UploadFiles;
use App\Models\Traits\Uuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Video extends Model
{
    use SoftDeletes, Uuid, UploadFiles;

    const RATTING = [
        'L',
        '+10',
        '+12',
        '+14',
        '+16',
        '+18'
    ];

    const VIDEO_FILE_MAX_SIZE = 1024 * 1024 * 5; //5GB
    const THUMB_FILE_MAX_SIZE = 1024 * 5; //5MB
    const BANNER_FILE_MAX_SIZE = 1024 * 10; //10MB
    const TRAILER_FILE_MAX_SIZE = 1024 * 1024 * 1; //1GB
    protected $keyType = 'string';
    protected $fillable = [
        'title',
        'description',
        'year_launched',
        'duration',
        'opened',
        'rating',
        'video_file',
        'thumb_file',
        'banner_file',
        'trailer_file'
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

    public static $fileFields = ['video_file', 'thumb_file','banner_file','trailer_file'];

    public static function create(array $att = [])
    {
        $files = self::extractFiles($att);
        try {
            \DB::beginTransaction();
            $obj = static::query()->create($att);
            static::handleRelations($obj, $att);
            $obj->uploadFiles($files);
            \DB::commit();
            return $obj;
        } catch (\Exception $e) {
            if (isset($obj)) {
                $obj->deleteFiles($files);
            }
            \DB::rollBack();
            throw $e;
        }
    }

    public function update(array $att = [], $options = [])
    {
        $files = self::extractFiles($att);
        try {
            \DB::beginTransaction();
            $saved = parent::update($att, $options);
            static::handleRelations($this, $att);
            if ($saved) {
                $this->uploadFiles($files);
            }
            \DB::commit();
            if ($saved && \count($files)) {
                $this->deleteOldFiles();
            }
            return $saved;
        } catch (\Exception $e) {
            if (isset($saved)) {
                $this->deleteFiles($files);
            }
            \DB::rollBack();
            throw $e;
        }
    }

    protected static function handleRelations(Video $video, array $att)
    {
        if (isset($att['categories_id'])) {
            $video->categories()->sync($att['categories_id']);
        }
        if (isset($att['genres_id'])) {
            $video->genres()->sync($att['genres_id']);
        }
        if (isset($att['cast_members_id'])) {
            $video->castMembers()->sync($att['cast_members_id']);
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

    public function castMembers()
    {
        return $this->belongsToMany(CastMember::class)->withTrashed();
    }

    protected function uploadDir()
    {
        return $this->id;
    }

    public function getThumbFileUrlAttribute()
    {
        return $this->thumb_file ? $this->getFileUrl($this->thumb_file) : null;
    }

    public function getBannerFileUrlAttribute()
    {
        return $this->banner_file ? $this->getFileUrl($this->banner_file) : null;
    }

    public function getTrailerFileUrlAttribute()
    {
        return $this->trailer_file ? $this->getFileUrl($this->trailer_file) : null;
    }

    public function getVideoFileUrlAttribute()
    {
        return $this->video_file ? $this->getFileUrl($this->video_file) : null;
    }
}
