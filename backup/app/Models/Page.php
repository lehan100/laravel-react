<?php

namespace App\Models;

use Astrotomic\Translatable\Contracts\Translatable as TranslatableContract;
use Astrotomic\Translatable\Translatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class Page extends Model implements TranslatableContract
{
    use HasFactory, Translatable;

    protected $fillable = [
        'field_group_id',
        'title',
        'slug',
        'status',
        'acf_data',
    ];

    public $translatedAttributes = [
        'title',
    ];

    public $translationModel = PageTranslation::class;

    protected function casts(): array
    {
        return [
            'field_group_id' => 'integer',
            'status' => 'boolean',
            'acf_data' => 'array',
        ];
    }

    public function fieldGroup(): BelongsTo
    {
        return $this->belongsTo(FieldGroup::class);
    }

    public function slugs(): MorphMany
    {
        return $this->morphMany(Slug::class, 'sluggable');
    }

    public function slug(): MorphOne
    {
        return $this->morphOne(Slug::class, 'sluggable')
            ->where('locale', app()->getLocale())
            ->where('is_default', true)
            ->whereNull('redirect_to');
    }

    protected static function booted(): void
    {
        static::deleting(function (self $page): void {
            $page->slugs()->delete();
        });
    }

    public function hasContent(): bool
    {
        return $this->containsFilledValue($this->acf_data ?? []);
    }

    /**
     * @param  array<string|int, mixed>  $data
     */
    private function containsFilledValue(array $data): bool
    {
        foreach ($data as $value) {
            if (is_array($value)) {
                if ($this->containsFilledValue($value)) {
                    return true;
                }

                continue;
            }

            if (filled($value) || $value === 0 || $value === '0') {
                return true;
            }
        }

        return false;
    }
}
