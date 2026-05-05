<?php

namespace App\Http\Controllers\Admin\PageManager;

use App\Http\Controllers\MainController;
use Illuminate\Http\Request;

class PageController extends MainController
{
    public function index(): never
    {
        $this->unavailable();
    }

    public function create(): never
    {
        $this->unavailable();
    }

    public function store(Request $request): never
    {
        $this->unavailable();
    }

    public function show(string $id): never
    {
        $this->unavailable();
    }

    public function edit(string $id): never
    {
        $this->unavailable();
    }

    public function update(Request $request, string $id): never
    {
        $this->unavailable();
    }

    public function destroy(string $id): never
    {
        $this->unavailable();
    }

    public function destroyMany(Request $request): never
    {
        $this->unavailable();
    }

    public function toggleStatus(string $id): never
    {
        $this->unavailable();
    }

    private function unavailable(): never
    {
        abort(404);
    }
}
