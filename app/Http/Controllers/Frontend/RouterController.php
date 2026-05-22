<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Repositories\Slug\SlugRepositoryInterface;
use Illuminate\Http\Request;

class RouterController extends Controller
{
    protected $slugRepository;

    public function __construct(SlugRepositoryInterface $slugRepository)
    {
        $this->slugRepository = $slugRepository;
    }

    public function resolve(Request $request, $slug)
    {
        // 1. Tra cứu slug đang hoạt động qua Repository
        $slugRecord = $this->slugRepository->getActiveSlug($slug);

        if (! $slugRecord) {
            abort(404);
        }

        // Nếu đây là slug cũ, redirect 301 sang slug mới
        if ($slugRecord->redirect_to) {
            return redirect()->to($slugRecord->redirect_to, 301);
        }

        // 2. Tải bản ghi dữ liệu gốc
        $model = $slugRecord->sluggable;

        if (! $model || (isset($model->status) && $model->status != 1)) {
            abort(404);
        }

        // 3. Phân luồng điều hướng dựa vào loại dữ liệu
        $type = $slugRecord->sluggable_type;

        if (str_contains($type, 'Category')) {
            return app()->call([CategoryController::class, 'show'], ['category' => $model]);
        }

        if (str_contains($type, 'Product')) {
            return app()->call([ProductController::class, 'show'], ['product' => $model]);
        }

        if (str_contains($type, 'Post')) {
            return app()->call([PostController::class, 'show'], ['post' => $model]);
        }

        if (str_contains($type, 'Page')) {
            return app()->call([PageController::class, 'show'], ['page' => $model]);
        }

        abort(404);
    }
}
