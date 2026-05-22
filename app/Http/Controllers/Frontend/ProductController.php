<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Catalog\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * @param  Product  $product
     */
    public function show(Request $request, $product)
    {
        // TODO: Viết logic truy vấn ở đây
        // Ví dụ: $relatedProducts = ...

        return Inertia::render('Home/Product/Show', [
            'product' => $product,
        ]);
    }
}
