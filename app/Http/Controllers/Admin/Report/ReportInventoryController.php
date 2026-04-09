<?php

namespace App\Http\Controllers\Admin\Report;

use App\Http\Controllers\MainController;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ReportInventoryController extends MainController
{
    public function index()
    {
        return response('ReportInventory index (blank scaffold)');
    }

    public function create()
    {
        return response('ReportInventory create (blank scaffold)');
    }

    public function store(Request $request): RedirectResponse
    {
        return redirect()->route('report-inventory.index');
    }

    public function show(string $id)
    {
        return response("ReportInventory show {$id} (blank scaffold)");
    }

    public function edit(string $id)
    {
        return response("ReportInventory edit {$id} (blank scaffold)");
    }

    public function update(Request $request, string $id): RedirectResponse
    {
        return redirect()->route('report-inventory.index');
    }

    public function destroy(string $id): RedirectResponse
    {
        return redirect()->route('report-inventory.index');
    }

    public function destroyMany(Request $request): RedirectResponse
    {
        return redirect()->route('report-inventory.index');
    }
}
