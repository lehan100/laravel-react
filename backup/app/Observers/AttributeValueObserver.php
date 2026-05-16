<?php

namespace App\Observers;

use App\Models\Catalog\AttributeValue;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class AttributeValueObserver
{
    public function saving(AttributeValue $attributeValue): void
    {
        $this->moveTempImage($attributeValue);
    }

    public function saved(AttributeValue $attributeValue): void
    {
        if ($attributeValue->wasChanged('image')) {
            $this->deleteStoredImage($attributeValue->getOriginal('image'));
        }
    }

    public function deleted(AttributeValue $attributeValue): void
    {
        if ($attributeValue->isForceDeleting()) {
            $this->deleteStoredImage($attributeValue->image);
        }
    }

    public function forceDeleted(AttributeValue $attributeValue): void
    {
        $this->deleteStoredImage($attributeValue->image);
    }

    public function restoring(AttributeValue $attributeValue): void
    {
        // No-op. Images remain in place when a value is restored.
    }

    private function moveTempImage(AttributeValue $attributeValue): void
    {
        if (! is_string($attributeValue->image) || $attributeValue->image === '') {
            return;
        }

        $imageName = $this->imageName($attributeValue->image);
        $tempPath = public_path('var/temp/'.$imageName);

        if (! File::exists($tempPath)) {
            return;
        }

        $targetDirectory = public_path('media/attribute');
        File::ensureDirectoryExists($targetDirectory);
        $targetPath = $targetDirectory.DIRECTORY_SEPARATOR.$imageName;

        if (File::exists($targetPath)) {
            File::delete($targetPath);
        }

        File::move($tempPath, $targetPath);
    }

    private function deleteStoredImage(?string $image): void
    {
        if (! is_string($image) || $image === '') {
            return;
        }

        $imageName = $this->imageName($image);
        $paths = [
            public_path('media/attribute/'.$imageName),
            public_path('var/temp/'.$imageName),
        ];

        foreach ($paths as $storedPath) {
            if (File::exists($storedPath)) {
                File::delete($storedPath);
            }
        }
    }

    private function imageName(string $image): string
    {
        return basename(Str::of($image)->before('?')->toString());
    }
}
