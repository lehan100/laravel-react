<?php

namespace App\Http\Controllers\Admin\Sales;

use App\Http\Controllers\MainController;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class PaymentMethodController extends MainController
{
    public function index()
    {
        return response('PaymentMethod index (blank scaffold)');
    }

    public function create()
    {
        return response('PaymentMethod create (blank scaffold)');
    }

    public function store(Request $request): RedirectResponse
    {
        return redirect()->route('payment-methods.index');
    }

    public function show(string $id)
    {
        return response("PaymentMethod show {$id} (blank scaffold)");
    }

    public function edit(string $id)
    {
        return response("PaymentMethod edit {$id} (blank scaffold)");
    }

    public function update(Request $request, string $id): RedirectResponse
    {
        return redirect()->route('payment-methods.index');
    }

    public function destroy(string $id): RedirectResponse
    {
        return redirect()->route('payment-methods.index');
    }

    public function destroyMany(Request $request): RedirectResponse
    {
        return redirect()->route('payment-methods.index');
    }
}

