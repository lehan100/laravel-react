<?php

namespace App\Http\Controllers\Admin\Report;

use App\Http\Controllers\MainController;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ReportProductController extends MainController
{
    public function index()
    {
        return response('ReportProduct index (blank scaffold)');
    }

    public function create()
    {
        return response('ReportProduct create (blank scaffold)');
    }

    public function store(Request $request): RedirectResponse
    {
        return redirect()->route('report-product.index');
    }

    public function show(string $id)
    {
        return response("ReportProduct show {$id} (blank scaffold)");
    }

    public function edit(string $id)
    {
        return response("ReportProduct edit {$id} (blank scaffold)");
    }

    public function update(Request $request, string $id): RedirectResponse
    {
        return redirect()->route('report-product.index');
    }

    public function destroy(string $id): RedirectResponse
    {
        return redirect()->route('report-product.index');
    }

    public function destroyMany(Request $request): RedirectResponse
    {
        return redirect()->route('report-product.index');
    }
}
