<?php

namespace App\Pipelines\Seo\Pipes;

use App\Pipelines\Seo\SeoData;
use Closure;

class GenerateOpenGraph
{
    public function handle(SeoData $data, Closure $next)
    {
        $locale = app()->getLocale();
        $ogLocale = $locale === 'vi' ? 'vi_VN' : ($locale === 'en' ? 'en_US' : $locale);

        $og = [
            'og:title' => $data->title,
            'og:description' => $data->description,
            'og:type' => $data->type,
            'og:url' => $data->url,
            'og:image' => $data->image,
            'og:site_name' => config('app.name'),
            'og:locale' => $ogLocale,
        ];

        // Nếu là bài viết, thêm các thẻ thời gian để bot biết độ mới của nội dung
        if ($data->type === 'article') {
            if ($data->published_time) {
                $og['article:published_time'] = $data->published_time;
            }
            if ($data->modified_time) {
                $og['article:modified_time'] = $data->modified_time;
            }
        }

        $data->meta['og'] = $og;

        return $next($data);
    }
}
