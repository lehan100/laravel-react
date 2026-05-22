<?php

namespace App\Repositories\Slug;

use App\Models\Slug;
use App\Repositories\EloquentRepository;

class SlugEloquentRepository extends EloquentRepository implements SlugRepositoryInterface
{
    /**
     * @return string
     */
    public function getModel()
    {
        return Slug::class;
    }

    /**
     * Lấy bản ghi Slug đang hoạt động theo chuỗi slug
     *
     * @return Slug|null
     */
    public function getActiveSlug(string $slug)
    {
        return $this->_model->where('slug', $slug)
            ->where('status', 1)
            ->first();
    }

    public function lists($params = null, $options = null)
    {
        return null;
    }

    public function get($params = null, $options = null)
    {
        return null;
    }

    public function save($params = null, $options = null)
    {
        return null;
    }

    public function delete($params = null, $options = null)
    {
        return null;
    }
}
