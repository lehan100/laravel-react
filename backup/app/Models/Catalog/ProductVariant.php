<?php

namespace App\Models\Catalog;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductVariant extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'sku',
        'price',
        'stock',
        'image',
        'images',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'stock' => 'integer',
            'images' => 'array',
        ];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function attributeValues(): BelongsToMany
    {
        return $this->belongsToMany(
            AttributeValue::class,
            'variant_attribute_values',
            'product_variant_id',
            'attribute_value_id'
        )->with('attribute')->withTimestamps();
    }

    public function translations(): HasMany
    {
        return $this->hasMany(ProductVariantTranslation::class, 'product_variant_id');
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
            return null;
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

        return null;
    }
}
