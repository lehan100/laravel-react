<?php

namespace App\Repositories\Slug;

use App\Models\Slug;
use App\Repositories\EloquentRepositoryInterface;

interface SlugRepositoryInterface extends EloquentRepositoryInterface
{
    /**
     * Lấy bản ghi Slug đang hoạt động theo chuỗi slug
     *
     * @return Slug|null
     */
    public function getActiveSlug(string $slug);
}
