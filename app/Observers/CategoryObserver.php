<?php

namespace App\Observers;

use App\Models\Category;
use Illuminate\Support\Facades\Log;

class CategoryObserver
{
    /**
     * Handle the Category "created" event.
     */
    public function created(Category $category): void
    {
        //
        $category->load('translations');
        Log::info("--- NEW CATEGORY CREATED ---", [
            'item' => $category->toArray()
        ]);
    }

    /**
     * Handle the Category "updated" event.
     */
    public function updated(Category $category): void
    {
        //
    }

    /**
     * Handle the Category "deleted" event.
     */
    public function deleting(Category $category): void
    {
        if ($category->isForceDeleting()) {
            $category->translations()->get()->each->forceDelete();

            $category->slugs()->delete();
        } else {
            $category->translations()->get()->each->delete();
            $category->slugs()->update(['status' => 0]);
        }
    }
    public function deleted(Category $category): void
    {
        //
    }

    /**
     * Handle the Category "restored" event.
     */
    public function restored(Category $category): void
    {
        //
        $category->translations()->withTrashed()->get()->each->restore();
        $category->slugs()->update(['status' => 1]);
    }

    /**
     * Handle the Category "force deleted" event.
     */
    public function forceDeleted(Category $category): void
    {
        //
    }
}
