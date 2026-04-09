<?php

namespace App\Http\Controllers\Admin\Report;

use App\Http\Controllers\MainController;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ReportRevenueController extends MainController
{
    public function index()
    {
        return response('ReportRevenue index (blank scaffold)');
    }

    public function create()
    {
        return response('ReportRevenue create (blank scaffold)');
    }

    public function store(Request $request): RedirectResponse
    {
        return redirect()->route('report-revenue.index');
    }

    public function show(string $id)
    {
        return response("ReportRevenue show {$id} (blank scaffold)");
    }

    public function edit(string $id)
    {
        return response("ReportRevenue edit {$id} (blank scaffold)");
    }

    public function update(Request $request, string $id): RedirectResponse
    {
        return redirect()->route('report-revenue.index');
    }

    public function destroy(string $id): RedirectResponse
    {
        return redirect()->route('report-revenue.index');
    }

    public function destroyMany(Request $request): RedirectResponse
    {
        return redirect()->route('report-revenue.index');
    }
}
