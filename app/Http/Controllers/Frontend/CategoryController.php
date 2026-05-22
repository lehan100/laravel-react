<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Catalog\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * @param  Category  $category
     */
    public function show(Request $request, $category)
    {
        // TODO: Viết logic truy vấn ở đây
        // Ví dụ: $products = $category->products()->active()->paginate(20);

        return Inertia::render('Home/Category/Index', [
            'category' => $category,
        ]);
    }
}
