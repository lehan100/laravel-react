<?php

namespace App\Observers;

use Illuminate\Support\Facades\File;

class ImageFileObserver
{
    public function saving($model)
    {
        $column = $model->getImageColumn();
        if ($model->isDirty($column) && $model->$column) {
            $model->uploadImage($model->$column);
            if ($model->exists) {
                $oldImage = $model->getOriginal($column);
                if ($oldImage && $oldImage != $model->$column) {
                    $this->deletePhysicalFile($model->getImagePath(), $oldImage);
                }
            }
        }
    }

    public function deleted($model)
    {
        $this->processDelete($model);
    }

    public function forceDeleted($model)
    {
        $this->processDelete($model);
    }

    protected function processDelete($model)
    {
        $column   = $model->getImageColumn();
        $fileName = $model->$column;
        $path = $model->getImagePath();
        if (!is_array($path) || !isset($path['path'])) {
            $path = config('image.path.default');
        }
        $mainDir = $path['path'] ?? 'media/upload';
        if ($fileName && is_string($fileName)) {
            $this->deletePhysicalFile($mainDir, $fileName);
        }
    }

    protected function deletePhysicalFile($path, $fileName)
    {
        if (is_array($path)) {
            $path = $path['path'] ?? reset($path);
        }

        dispatch(function () use ($path, $fileName) {
            $fullPath = public_path($path . DIRECTORY_SEPARATOR . $fileName);
            if (File::exists($fullPath)) {
                File::delete($fullPath);
            }
        })->afterResponse();
    }
}
