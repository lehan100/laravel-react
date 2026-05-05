<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FieldGroup extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'fields_schema',
    ];

    protected function casts(): array
    {
        return [
            'fields_schema' => 'array',
        ];
    }

    public function pages(): HasMany
    {
        return $this->hasMany(Page::class);
    }
}
