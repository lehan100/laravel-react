<?php

namespace App\Repositories\Post;

use App\Models\Catalog\Post;
use App\Repositories\EloquentRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

interface PostRepositoryInterface extends EloquentRepositoryInterface
{
    public function createScheduledPost(array $data): Post;

    public function getDuePosts(int $limit = 50): Collection;
}
