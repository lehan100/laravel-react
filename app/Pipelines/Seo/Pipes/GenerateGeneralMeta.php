<?php

namespace App\Pipelines\Seo\Pipes;

use App\Pipelines\Seo\SeoData;
use Closure;

class GenerateGeneralMeta
{
    public function handle(SeoData $data, Closure $next)
    {
        // 1. Gán Title, Description, Keyword
        $data->meta['title'] = $data->title;
        $data->meta['description'] = $data->description;

        if (! empty($data->keyword)) {
            $data->meta['keyword'] = $data->keyword;
        }

        // 2. Canonical URL chống trùng lặp nội dung
        $data->meta['canonical'] = $data->url;

        return $next($data);
    }
}
