<?php

namespace App\Pipelines\Seo;

class SeoData
{
    public string $title;

    public string $description;

    public string $keyword;

    public string $image;

    public string $url;

    public string $type;

    public array $schema;

    public ?string $published_time;

    public ?string $modified_time;

    // Nơi chứa dữ liệu sau khi chạy qua các Pipes
    public array $meta = [];

    public function __construct(array $data = [])
    {
        $this->title = ! empty($data['title']) ? $data['title'] : (__('page.meta_title') ?: config('app.name'));
        $this->description = ! empty($data['description']) ? $data['description'] : __('page.meta_description');
        $this->keyword = ! empty($data['keyword']) ? $data['keyword'] : __('page.meta_keyword');
        $this->image = ! empty($data['image']) ? $data['image'] : asset(config('image.path.photo.path', '').'/'.__('page.logo'));
        $this->url = $data['url'] ?? request()->url();
        $this->type = $data['type'] ?? 'website'; // 'website', 'article', 'product'
        $this->schema = $data['schema'] ?? [];
        $this->published_time = $data['published_time'] ?? null;
        $this->modified_time = $data['modified_time'] ?? null;
    }

    public function toArray(): array
    {
        return $this->meta;
    }
}
