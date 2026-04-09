<?php

namespace App\Http\Controllers\Admin\Sales;

use App\Http\Controllers\MainController;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class OrderController extends MainController
{
    public function index()
    {
        return response('Order index (blank scaffold)');
    }

    public function create()
    {
        return response('Order create (blank scaffold)');
    }

    public function store(Request $request): RedirectResponse
    {
        return redirect()->route('orders.index');
    }

    public function show(string $id)
    {
        return response("Order show {$id} (blank scaffold)");
    }

    public function edit(string $id)
    {
        return response("Order edit {$id} (blank scaffold)");
    }

    public function update(Request $request, string $id): RedirectResponse
    {
        return redirect()->route('orders.index');
    }

    public function destroy(string $id): RedirectResponse
    {
        return redirect()->route('orders.index');
    }

    public function destroyMany(Request $request): RedirectResponse
    {
        return redirect()->route('orders.index');
    }
}

