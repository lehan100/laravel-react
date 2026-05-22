<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Catalog\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PostController extends Controller
{
    /**
     * @param  Post  $post
     */
    public function show(Request $request, $post)
    {
        // TODO: Viết logic truy vấn bài viết liên quan...

        return Inertia::render('Home/Post/Show', [
            'post' => $post,
        ]);
    }
}
