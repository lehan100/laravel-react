<?php

namespace App\Http\Controllers\Admin\Report;

use App\Http\Controllers\MainController;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ReportPromotionController extends MainController
{
    public function index()
    {
        return response('ReportPromotion index (blank scaffold)');
    }

    public function create()
    {
        return response('ReportPromotion create (blank scaffold)');
    }

    public function store(Request $request): RedirectResponse
    {
        return redirect()->route('report-promotion.index');
    }

    public function show(string $id)
    {
        return response("ReportPromotion show {$id} (blank scaffold)");
    }

    public function edit(string $id)
    {
        return response("ReportPromotion edit {$id} (blank scaffold)");
    }

    public function update(Request $request, string $id): RedirectResponse
    {
        return redirect()->route('report-promotion.index');
    }

    public function destroy(string $id): RedirectResponse
    {
        return redirect()->route('report-promotion.index');
    }

    public function destroyMany(Request $request): RedirectResponse
    {
        return redirect()->route('report-promotion.index');
    }
}
