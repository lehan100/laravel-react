<?php

namespace App\Observers;

use App\Models\Page;
use Illuminate\Support\Facades\Log;

class PageObserver
{
    public function created(Page $page): void
    {
        Log::info('--- NEW PAGE VALUE CREATED ---', [
            'id' => $page->id,
            'field_group_id' => $page->field_group_id,
            'slug' => $page->slug,
        ]);
    }

    public function updated(Page $page): void
    {
        Log::info('--- PAGE VALUE UPDATED ---', [
            'id' => $page->id,
            'changed' => array_keys($page->getChanges()),
        ]);
    }

    public function deleted(Page $page): void
    {
        Log::info('--- PAGE VALUE DELETED ---', [
            'id' => $page->id,
            'slug' => $page->slug,
        ]);
    }
}
