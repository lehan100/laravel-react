<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\MainController;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends MainController
{
    protected $controllerView = 'Admin/Dashboard/';
    public function index(): Response
    {
        return Inertia::render($this->controllerView . 'Index');
    }
}
