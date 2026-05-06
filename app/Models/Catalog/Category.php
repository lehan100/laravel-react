<?php

namespace App\Models\Catalog;

use App\Models\Page;
use App\Models\Slug;
use App\Traits\HasImageFile;
use Astrotomic\Translatable\Contracts\Translatable as TranslatableContract;
use Astrotomic\Translatable\Translatable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property-read Collection<int, Product> $products
 */
class Category extends Model implements TranslatableContract
{
    use HasFactory, HasImageFile, SoftDeletes, Translatable;

    protected $table = 'categories';

    protected $fillable = [
        'status',
        'order',
        'parent_id',
        'type',
        'photo',
        'page_id',
    ];

    public $translatedAttributes = [
        'name',
        'description',
        'content',
        'seo_title',
        'seo_keyword',
        'seo_description',
    ];

    protected $imageColumn = 'photo';

    public function getImagePath()
    {
        return config('image.path.category', null);
    }

    public function slugs(): MorphMany
    {
        return $this->morphMany(Slug::class, 'sluggable');
    }

    public function slug()
    {
        return $this->morphOne(Slug::class, 'sluggable')
            ->where('locale', app()->getLocale())
            ->where('is_default', true)
            ->whereNull('redirect_to');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Category::class, 'parent_id')->orderBy('order');
    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'category_product');
    }

    public function page(): BelongsTo
    {
        return $this->belongsTo(Page::class);
    }

    // protected static function booted()
    // {
    //     static::deleting(function ($category) {
    //         $category->translations()->get()->each(function ($translation) {
    //             $translation->delete();
    //         });

    //         if ($category->isForceDeleting()) {
    //             $category->slugs()->delete();
    //         }
    //     });
    // }
}
