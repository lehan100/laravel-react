<?php

namespace App\Traits;

use Illuminate\Support\Facades\File;
use Intervention\Image\Facades\Image;

trait HasImageFile
{
    public function getImagePath()
    {
        $path = property_exists($this, 'imageFolder') ? $this->imageFolder : 'upload';
        if (is_array($path)) {
            $path = $path['path'] ?? reset($path);
        }

        return (string) $path;
    }

    public function getImageColumn()
    {
        return property_exists($this, 'imageColumn') ? $this->imageColumn : 'photo';
    }

    public function uploadImage($fileName)
    {
        if (is_array($fileName)) {
            $fileName = $fileName[app()->getLocale()] ?? reset($fileName);
        }
        if (empty($fileName) || ! is_string($fileName)) {
            return $fileName;
        }
        $path = $this->getImagePath();
        if (! is_array($path) || ! isset($path['path'])) {
            $path = config('image.path.default');
        }
        $tempDir = $path['temp'] ?? 'var/temp';
        $mainDir = $path['path'] ?? 'media/upload';
        $pathTmp = public_path($tempDir.DIRECTORY_SEPARATOR.$fileName);
        $pathMain = public_path($mainDir);
        if (File::exists($pathTmp)) {
            if (! File::exists($pathMain)) {
                File::makeDirectory($pathMain, 0755, true);
            }

            Image::make($pathTmp)->save($pathMain.DIRECTORY_SEPARATOR.$fileName);
            File::delete($pathTmp);
        }

        return $fileName;
    }
}
