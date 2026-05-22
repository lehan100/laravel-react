<?php

namespace App\Pipelines\Seo\Pipes;

use App\Pipelines\Seo\SeoData;
use Closure;

class GenerateJsonLd
{
    public function handle(SeoData $data, Closure $next)
    {
        // 1. Nếu người dùng tự truyền schema (ví dụ: schema Product), thì ưu tiên dùng nó
        if (! empty($data->schema)) {
            $data->meta['json_ld'] = $data->schema;

            return $next($data);
        }

        // 2. Nếu không có, fallback tự động khởi tạo Schema cơ bản
        $schema = [
            '@context' => 'https://schema.org',
            '@type' => $data->type === 'article' ? 'Article' : 'WebPage',
            'headline' => $data->title,
            'description' => $data->description,
            'image' => [
                $data->image,
            ],
            'url' => $data->url,
        ];

        // 3. Thông tin thời gian cho bài viết
        if ($data->type === 'article') {
            if ($data->published_time) {
                $schema['datePublished'] = $data->published_time;
            }
            if ($data->modified_time) {
                $schema['dateModified'] = $data->modified_time;
            }
        }

        $data->meta['json_ld'] = $schema;

        return $next($data);
    }
}
