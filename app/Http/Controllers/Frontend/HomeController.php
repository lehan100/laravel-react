<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Pipelines\Seo\SeoPipeline;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Hiển thị trang chủ với đầy đủ Meta SEO
     */
    public function index()
    {
        $seoData = SeoPipeline::generate([
            'title' => __('page.meta_title') ?: config('app.name'),
            'description' => __('page.meta_description'),
            'keyword' => __('page.meta_keyword'),
            'type' => 'website',
            'url' => route('home'),
        ]);

        return Inertia::render('Frontend/Home/Index', [
            'seo' => $seoData,
        ]);
    }
}
