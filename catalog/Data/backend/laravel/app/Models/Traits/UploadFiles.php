<?php


namespace App\Models\Traits;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;

trait UploadFiles
{
  public $oldFiles = [];

  protected abstract function uploadDir();

  public static function bootUploadFiles()
  {
    static::updating(function(Model $model){
      $fieldsdUpdated = array_keys($model->getDirty());
      $filesUpdated = array_intersect($fieldsdUpdated, self::$fileFields);
      $filesFiltered = Arr::where($filesUpdated, function($fileField) use ($model){
        return $model->getOriginal($fileField);
      });
      $model->oldFiles = array_map(function($fileField) use ($model){
        return $model->getOriginal($fileField);
      }, $filesFiltered);
    });
  }
  /**
   * @param UploadedFile[] $files
   */
  public function uploadFiles(array $files)
  {
    foreach ($files as $file) {

      $this->uploadFile($file);
    }
  }

  public function uploadFile(UploadedFile $file)
  {
    $file->store($this->uploadDir());
  }

  public function deleteFiles(array $files)
  {

    foreach ($files as $file) {

      $this->deleteFile($file);
    }
  }

  public function deleteOldFiles()
  {
    $this->deleteFiles($this->oldFiles);
  }


  /**
   * @param string|UploadedFile $file
   */
  public function deleteFile($file)
  {
    $filename = $file instanceof UploadedFile ? $file->hashName() : $file;
    \Storage::delete("{$this->uploadDir()}/{$filename}");
  }

  public static function extractFiles(array &$attributes = [])
  {
    $files = [];
    foreach (self::$fileFields as $file) {
      if (isset($attributes[$file]) && $attributes[$file] instanceof UploadedFile) {

        $files[] = $attributes[$file];
        $attributes[$file] = $attributes[$file]->hashName();
      }
    }

    return $files;
  }

  public function relativeFilePath($value)
  {
    return "{$this->uploadDir()}/{$value}";
  }
  
  protected function getFileUrl($filename)
  {

    return \Storage::url($this->relativeFilePath($filename));
  }

  
}
