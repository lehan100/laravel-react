<?php

namespace App\Http\Controllers\Admin\Sales;

use App\Http\Controllers\MainController;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class WarehouseController extends MainController
{
    public function index()
    {
        return response('Warehouse index (blank scaffold)');
    }

    public function create()
    {
        return response('Warehouse create (blank scaffold)');
    }

    public function store(Request $request): RedirectResponse
    {
        return redirect()->route('warehouse.index');
    }

    public function show(string $id)
    {
        return response("Warehouse show {$id} (blank scaffold)");
    }

    public function edit(string $id)
    {
        return response("Warehouse edit {$id} (blank scaffold)");
    }

    public function update(Request $request, string $id): RedirectResponse
    {
        return redirect()->route('warehouse.index');
    }

    public function destroy(string $id): RedirectResponse
    {
        return redirect()->route('warehouse.index');
    }

    public function destroyMany(Request $request): RedirectResponse
    {
        return redirect()->route('warehouse.index');
    }
}

