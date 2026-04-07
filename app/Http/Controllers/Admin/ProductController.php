<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\MainController;
use App\Http\Requests\CategoryRequest;
use App\Http\Resources\CategoryCollection;
use App\Http\Resources\CategoryResource;
use App\Repositories\Product\ProductRepositoryInterface as RepositoryInterface;
use App\Repositories\Category\CategoryRepositoryInterface as CategoryRepositoryInterface;
use Illuminate\Support\Facades\Redirect;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;

class ProductController extends MainController
{
    protected $controllerView = 'Admin/Product/';
    protected $routeName = 'product.';
    protected $mainModel;
    protected $categoryModel;
    public function __construct(RepositoryInterface $repository, CategoryRepositoryInterface $categoryModel)
    {
        $this->mainModel = $repository;
        $this->categoryModel = $categoryModel;
        $this->middleware(function ($request, $next) {
            $currentLocale = app()->getLocale();
            $configPath = config('image.path.product');
            $languageConfigPath = config('image.path.photo');
            Inertia::share([
                'config_path' => $configPath,
                'languageConfigPath' => $languageConfigPath
            ]);

            return $next($request);
        });
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        return Inertia::render($this->controllerView . 'Index', []);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
