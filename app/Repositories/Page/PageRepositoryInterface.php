<?php

namespace App\Repositories\Page;

use App\Repositories\EloquentRepositoryInterface;

interface PageRepositoryInterface extends EloquentRepositoryInterface
{
    /**
     * @return array<string, mixed>
     */
    public function getFormProps($params = null): array;

    /**
     * @return array<string, string|array<string, string>>
     */
    public function translations(): array;
}
