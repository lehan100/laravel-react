<?php

namespace App\Repositories\FieldGroup;

use App\Repositories\EloquentRepositoryInterface;

interface FieldGroupRepositoryInterface extends EloquentRepositoryInterface
{
    public function isInUse(int $id): bool;

    /**
     * @return array<string, mixed>
     */
    public function getFormProps($params = null): array;

    /**
     * @return array<string, string|array<string, string>>
     */
    public function translations(): array;
}
