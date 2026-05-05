<?php

namespace App\Http\Controllers\Admin\Dashboard;

use App\Http\Controllers\MainController;
use App\Repositories\Dashboard\DashboardRepositoryInterface;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends MainController
{
    protected string $controllerView = 'Admin/Dashboard/';

    public function __construct(private readonly DashboardRepositoryInterface $dashboard)
    {
        parent::__construct();
    }

    public function index(): Response
    {
        return Inertia::render($this->controllerView.'Index', [
            'dashboard' => $this->dashboard->data(),
        ]);
    }
}
