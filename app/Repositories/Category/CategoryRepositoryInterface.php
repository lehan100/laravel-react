<?php

namespace App\Repositories\Category;

use App\Repositories\EloquentRepositoryInterface;

interface CategoryRepositoryInterface extends EloquentRepositoryInterface
{
    /**
     * @param  array<int, int>  $categoryIds
     * @return array{data: array<int, array<string, mixed>>, meta: array<string, mixed>}
     */
    public function getProductPickerData(int $perPage = 10, string $search = '', array $categoryIds = []): array;

    /**
     * @param  array<int, int>  $ids
     * @return array<int, array<string, mixed>>
     */
    public function getSelectedProductRows(array $ids): array;

    /**
     * @return array<int, array<string, mixed>>
     */
    public function getActiveProductRows(): array;

    /**
     * @return array<int, int>
     */
    public function getCategoryAndDescendantIds(int $categoryId): array;
}
