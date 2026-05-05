<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Page extends Model
{
    use HasFactory;

    protected $fillable = [
        'field_group_id',
        'title',
        'slug',
        'acf_data',
    ];

    protected function casts(): array
    {
        return [
            'field_group_id' => 'integer',
            'acf_data' => 'array',
        ];
    }

    public function fieldGroup(): BelongsTo
    {
        return $this->belongsTo(FieldGroup::class);
    }
}
