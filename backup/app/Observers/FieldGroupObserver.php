<?php

namespace App\Observers;

use App\Models\FieldGroup;
use Illuminate\Support\Facades\Log;

class FieldGroupObserver
{
    public function created(FieldGroup $fieldGroup): void
    {
        Log::info('--- NEW PAGE SCHEMA CREATED ---', [
            'id' => $fieldGroup->id,
            'field_count' => count($fieldGroup->fields_schema ?? []),
        ]);
    }

    public function updated(FieldGroup $fieldGroup): void
    {
        Log::info('--- PAGE SCHEMA UPDATED ---', [
            'id' => $fieldGroup->id,
            'changed' => array_keys($fieldGroup->getChanges()),
        ]);
    }

    public function deleted(FieldGroup $fieldGroup): void
    {
        Log::info('--- PAGE SCHEMA DELETED ---', [
            'id' => $fieldGroup->id,
            'title' => $fieldGroup->title,
        ]);
    }
}
