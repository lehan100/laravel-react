<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Astrotomic\Translatable\Contracts\Translatable as TranslatableContract;
use Astrotomic\Translatable\Translatable;
use App\Traits\HasImageFile;

class Category extends Model implements TranslatableContract
{
    use HasFactory, SoftDeletes, HasImageFile, Translatable;

    protected $table = 'categories';
    protected $imageColumn = 'photo';
    protected $fillable = [
        'status',
        'order',
        'parent_id',
        'photo',
    ];

    public $translatedAttributes = [
        'name',
        'description',
        'content',
        'seo_title',   
        'seo_keyword',   
        'seo_description' 
    ];

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


    protected static function booted()
    {
        static::deleting(function ($category) {
            $category->translations()->get()->each(function ($translation) {
                $translation->delete();
            });

            if ($category->isForceDeleting()) {
                $category->slugs()->delete();
            }
        });
    }
}
