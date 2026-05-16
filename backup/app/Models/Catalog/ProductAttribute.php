<?php

namespace App\Models\Catalog;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Collection;

class ProductAttribute extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'attributes';

    protected $fillable = [
        'name',
        'code',
        'type',
        'status',
        'order',
    ];

    protected $casts = [
        'status' => 'boolean',
        'order' => 'integer',
    ];

    public function values(): HasMany
    {
        return $this->hasMany(AttributeValue::class, 'attribute_id');
    }

    public function translations(): HasMany
    {
        return $this->hasMany(ProductAttributeTranslation::class, 'attribute_id');
    }

    public function getNameAttribute(): ?string
    {
        return $this->getLocalizedName();
    }

    public function getLocalizedName(?string $locale = null): ?string
    {
        $translations = $this->relationLoaded('translations')
            ? $this->translations
            : $this->translations()->get();

        if ($translations->isEmpty()) {
            return is_string($this->attributes['name'] ?? null) && trim((string) $this->attributes['name']) !== ''
                ? trim((string) $this->attributes['name'])
                : null;
        }

        $locale ??= app()->getLocale();
        $normalizedLocale = strtolower(str_replace('_', '-', (string) $locale));
        $fallbackLocale = explode('-', $normalizedLocale)[0] ?: $normalizedLocale;

        foreach (array_unique(array_filter([(string) $locale, $normalizedLocale, $fallbackLocale])) as $candidate) {
            $value = $translations->firstWhere('locale', $candidate)?->name;

            if (is_string($value) && trim($value) !== '') {
                return trim($value);
            }
        }

        foreach ($translations as $translation) {
            if (is_string($translation->name) && trim($translation->name) !== '') {
                return trim($translation->name);
            }
        }

        return is_string($this->attributes['name'] ?? null) && trim((string) $this->attributes['name']) !== ''
            ? trim((string) $this->attributes['name'])
            : null;
    }

    public function getTranslationLocalesAttribute(): Collection
    {
        $translations = $this->relationLoaded('translations')
            ? $this->translations
            : $this->translations()->get();

        return $translations->pluck('locale')->values();
    }
}
