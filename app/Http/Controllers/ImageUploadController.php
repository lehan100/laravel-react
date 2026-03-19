<?php

namespace App\Http\Controllers;

//use Image;
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
            $fileNameWebp = Filter::setUrlKey($fileNameOnly) . '-' . time() . '.webp';
            $filePath = public_path($configPath['temp']);
            $img = $this->ImageManager::make($file->getRealPath());
            $img->resize(1200, null, function ($constraint) {
                $constraint->aspectRatio();     
                $constraint->upsize();         
            })->encode('webp', 60);             
            if (!file_exists($filePath)) {
                mkdir($filePath, 0755, true);
            }
            $img->save($filePath . '/' . $fileNameWebp);

            $url = asset($configPath['temp'] . '/' . $fileNameWebp);

            return response()->json([
                'file_name' => $fileNameWebp,
                'uploaded' => 1,
                'status' => true,
                'url' => $url
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
            $fileNameWebp = Filter::setUrlKey($fileNameOnly) . '-' . time() . '.webp';
            $filePath = public_path($configPath['temp']);
            $img = $this->ImageManager::make($file->getRealPath());
            $img->resize(1200, null, function ($constraint) {
                $constraint->aspectRatio();     
                $constraint->upsize();         
            })->encode('webp', 60);             
            if (!file_exists($filePath)) {
                mkdir($filePath, 0755, true);
            }
            $img->save($filePath . '/' . $fileNameWebp);

            $url = asset($configPath['temp'] . '/' . $fileNameWebp);

            return response()->json([
                'file_name' => $fileNameWebp,
                'uploaded' => 1,
                'status' => true,
                'url' => $url
            ]);
        }
    }
}
