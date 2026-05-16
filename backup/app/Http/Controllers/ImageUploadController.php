<?php

namespace App\Http\Controllers;

// use Image;
use App\Helpers\Filter;
use Illuminate\Http\Request;
use Intervention\Image\Facades\Image;

class ImageUploadController extends Controller
{
    protected $ImageManager;

    public $configPath;

    public function __construct(Image $image)
    {
        $this->ImageManager = $image;
        $this->configPath = config('image.path');
    }

    public function storePhoto(Request $request)
    {
        if ($request->hasFile('photo')) {
            $configPath = $this->configPath['photo'];
            $file = $request->file('photo');
            $originName = $file->getClientOriginalName();
            $fileNameOnly = pathinfo($originName, PATHINFO_FILENAME);
            $fileNameWebp = Filter::setUrlKey($fileNameOnly).'-'.time().'.webp';
            $filePath = public_path($configPath['temp']);
            $img = $this->ImageManager::make($file->getRealPath());
            $img->resize(1200, null, function ($constraint) {
                $constraint->aspectRatio();
                $constraint->upsize();
            })->encode('webp', 60);
            if (! file_exists($filePath)) {
                mkdir($filePath, 0755, true);
            }
            $img->save($filePath.'/'.$fileNameWebp);

            $url = asset($configPath['temp'].'/'.$fileNameWebp);

            return response()->json([
                'file_name' => $fileNameWebp,
                'uploaded' => 1,
                'status' => true,
                'url' => $url,
            ]);
        }
    }

    public function storeCategory(Request $request)
    {
        if ($request->hasFile('photo')) {
            $configPath = $this->configPath['category'];
            $file = $request->file('photo');
            $originName = $file->getClientOriginalName();
            $fileNameOnly = pathinfo($originName, PATHINFO_FILENAME);
            $fileNameWebp = Filter::setUrlKey($fileNameOnly).'-'.time().'.webp';
            $filePath = public_path($configPath['temp']);
            $img = $this->ImageManager::make($file->getRealPath());
            $img->resize(1200, null, function ($constraint) {
                $constraint->aspectRatio();
                $constraint->upsize();
            })->encode('webp', 60);
            if (! file_exists($filePath)) {
                mkdir($filePath, 0755, true);
            }
            $img->save($filePath.'/'.$fileNameWebp);

            $url = asset($configPath['temp'].'/'.$fileNameWebp);

            return response()->json([
                'file_name' => $fileNameWebp,
                'uploaded' => 1,
                'status' => true,
                'url' => $url,
            ]);
        }
    }

    public function storeProduct(Request $request)
    {
        $request->validate([
            'photo' => ['required', 'image', 'max:10240'],
        ]);

        if ($request->hasFile('photo')) {
            $configPath = $this->configPath['product'];
            $file = $request->file('photo');
            $originName = $file->getClientOriginalName();
            $fileNameOnly = pathinfo($originName, PATHINFO_FILENAME);
            $fileNameWebp = Filter::setUrlKey($fileNameOnly).'-'.time().'.webp';
            $filePath = public_path($configPath['temp']);
            $img = $this->ImageManager::make($file->getRealPath());
            $img->resize(800, null, function ($constraint) {
                $constraint->aspectRatio();
                $constraint->upsize();
            })->encode('webp', 85);
            if (! file_exists($filePath)) {
                mkdir($filePath, 0755, true);
            }
            $img->save($filePath.'/'.$fileNameWebp);

            $url = asset($configPath['temp'].'/'.$fileNameWebp);
            $dimensions = @getimagesize($filePath.'/'.$fileNameWebp);
            $sizeBytes = @filesize($filePath.'/'.$fileNameWebp);

            return response()->json([
                'file_name' => $fileNameWebp,
                'uploaded' => 1,
                'status' => true,
                'url' => $url,
                'width' => $dimensions[0] ?? null,
                'height' => $dimensions[1] ?? null,
                'size' => $sizeBytes ?: null,
                'size_label' => $this->formatFileSize($sizeBytes),
            ]);
        }
    }

    public function storeAttribute(Request $request)
    {
        $request->validate([
            'photo' => ['required', 'image', 'max:10240'],
        ]);

        if ($request->hasFile('photo')) {
            $configPath = $this->configPath['attribute'];
            $file = $request->file('photo');
            $originName = $file->getClientOriginalName();
            $fileNameOnly = pathinfo($originName, PATHINFO_FILENAME);
            $fileNameWebp = Filter::setUrlKey($fileNameOnly).'-'.time().'.webp';
            $filePath = public_path($configPath['temp']);
            $img = $this->ImageManager::make($file->getRealPath());
            $img->resize(800, null, function ($constraint) {
                $constraint->aspectRatio();
                $constraint->upsize();
            })->encode('webp', 85);
            if (! file_exists($filePath)) {
                mkdir($filePath, 0755, true);
            }
            $img->save($filePath.'/'.$fileNameWebp);

            $url = asset($configPath['temp'].'/'.$fileNameWebp);

            return response()->json([
                'file_name' => $fileNameWebp,
                'uploaded' => 1,
                'status' => true,
                'url' => $url,
            ]);
        }
    }

    private function formatFileSize($bytes): ?string
    {
        if (! is_numeric($bytes) || $bytes <= 0) {
            return null;
        }

        $units = ['B', 'KB', 'MB', 'GB'];
        $size = (float) $bytes;
        $index = 0;

        while ($size >= 1024 && $index < count($units) - 1) {
            $size /= 1024;
            $index++;
        }

        return rtrim(rtrim(number_format($size, $index === 0 ? 0 : 1, '.', ''), '0'), '.').' '.$units[$index];
    }
}
