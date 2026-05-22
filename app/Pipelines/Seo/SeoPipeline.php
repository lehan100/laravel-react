<?php

namespace App\Pipelines\Seo;

use App\Pipelines\Seo\Pipes\GenerateGeneralMeta;
use App\Pipelines\Seo\Pipes\GenerateJsonLd;
use App\Pipelines\Seo\Pipes\GenerateOpenGraph;
use App\Pipelines\Seo\Pipes\GenerateTwitterCard;
use Illuminate\Pipeline\Pipeline;

class SeoPipeline
{
    /**
     * Khởi tạo và chạy pipeline tạo SEO Meta array
     */
    public static function generate(array $input): array
    {
        $seoData = new SeoData($input);

        return app(Pipeline::class)
            ->send($seoData)
            ->through([
                GenerateGeneralMeta::class,
                GenerateOpenGraph::class,
                GenerateTwitterCard::class,
                GenerateJsonLd::class,
            ])
            ->thenReturn()
            ->toArray();
    }
}
