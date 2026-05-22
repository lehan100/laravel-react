<?php

namespace App\Pipelines\Seo\Pipes;

use App\Pipelines\Seo\SeoData;
use Closure;

class GenerateTwitterCard
{
    public function handle(SeoData $data, Closure $next)
    {
        $data->meta['twitter'] = [
            'twitter:card' => 'summary_large_image',
            'twitter:title' => $data->title,
            'twitter:description' => $data->description,
            'twitter:image' => $data->image,
        ];

        return $next($data);
    }
}
