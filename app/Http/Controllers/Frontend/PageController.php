<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PageController extends Controller
{
    /**
     * @param  Page  $page
     */
    public function show(Request $request, $page)
    {
        // TODO: Viết logic truy vấn các khối nội dung của page...

        return Inertia::render('Home/Page/Show', [
            'page' => $page,
        ]);
    }
}
