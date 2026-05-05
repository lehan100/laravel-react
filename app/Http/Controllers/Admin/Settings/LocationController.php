<?php

namespace App\Http\Controllers\Admin\Settings;

use App\Http\Controllers\MainController;
use App\Http\Resources\Settings\ProvinceCollection;
use App\Http\Resources\Settings\ProvinceResource;
use App\Http\Resources\Settings\WardCollection;
use App\Models\Settings\Province;
use App\Repositories\Location\LocationRepositoryInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LocationController extends MainController
{
    protected string $controllerView = 'Admin/Settings/Locations/';

    public function __construct(private readonly LocationRepositoryInterface $locations)
    {
        parent::__construct();
    }

    public function index(Request $request): Response
    {
        $search = trim((string) $request->string('search'));
        $perPage = max(10, min(100, (int) $request->integer('per_page', 20)));

        return Inertia::render($this->controllerView.'Index', [
            'items' => new ProvinceCollection($this->locations->provincePaginator([
                'search' => $search,
                'per_page' => $perPage,
            ])),
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
            ],
            'summary' => $this->locations->summary(),
        ]);
    }

    public function show(Request $request, Province $province): Response
    {
        $search = trim((string) $request->string('search'));
        $perPage = max(10, min(100, (int) $request->integer('per_page', 50)));

        return Inertia::render($this->controllerView.'Show', [
            'province' => new ProvinceResource($this->locations->loadProvinceForShow($province)),
            'wards' => new WardCollection($this->locations->wardPaginator($province, [
                'search' => $search,
                'per_page' => $perPage,
            ])),
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
            ],
            'summary' => $this->locations->provinceSummary($province),
        ]);
    }
}
