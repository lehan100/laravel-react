<?php

namespace App\Http\Controllers\Admin\Report;

use App\Http\Controllers\MainController;
use App\Services\Reports\AdminReportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportInventoryController extends MainController
{
    public function index(Request $request, AdminReportService $reports): Response
    {
        return Inertia::render('Admin/Report/Index', [
            'report' => $reports->build('inventory', $request),
            'analyzeRoute' => route('report-inventory.analyze'),
        ]);
    }

    public function analyze(Request $request, AdminReportService $reports): JsonResponse
    {
        return response()->json($reports->analyze('inventory', $request));
    }
}
