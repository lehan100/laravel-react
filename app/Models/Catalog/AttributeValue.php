<?php

namespace App\Models\Catalog;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class AttributeValue extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'attribute_id',
        'value',
        'image',
        'color',
        'order',
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    public function attribute(): BelongsTo
    {
        return $this->belongsTo(ProductAttribute::class, 'attribute_id');
    }

    public function translations(): HasMany
    {
        return $this->hasMany(AttributeValueTranslation::class, 'attribute_value_id');
    }

    public function variants(): BelongsToMany
    {
        return $this->belongsToMany(
            ProductVariant::class,
            'variant_attribute_values',
            'attribute_value_id',
            'product_variant_id'
        )->withTimestamps();
    }

    public function getValueAttribute(): ?string
    {
        return $this->getLocalizedValue();
    }

    public function getLocalizedValue(?string $locale = null): ?string
    {
        $translations = $this->relationLoaded('translations')
            ? $this->translations
            : $this->translations()->get();

        if ($translations->isEmpty()) {
            return is_string($this->attributes['value'] ?? null) && trim((string) $this->attributes['value']) !== ''
                ? trim((string) $this->attributes['value'])
                : null;
        }

        $locale ??= app()->getLocale();
        $normalizedLocale = strtolower(str_replace('_', '-', (string) $locale));
        $fallbackLocale = explode('-', $normalizedLocale)[0] ?: $normalizedLocale;

        foreach (array_unique(array_filter([(string) $locale, $normalizedLocale, $fallbackLocale])) as $candidate) {
            $value = $translations->firstWhere('locale', $candidate)?->value;

            if (is_string($value) && trim($value) !== '') {
                return trim($value);
            }
        }

        foreach ($translations as $translation) {
            if (is_string($translation->value) && trim($translation->value) !== '') {
                return trim($translation->value);
            }
        }

        return is_string($this->attributes['value'] ?? null) && trim((string) $this->attributes['value']) !== ''
            ? trim((string) $this->attributes['value'])
            : null;
    }
}
