<?php

namespace App\Repositories\Dashboard;

interface DashboardRepositoryInterface
{
    /**
     * @return array<string, mixed>
     */
    public function data(): array;
}
