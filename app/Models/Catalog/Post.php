<?php

namespace App\Models\Catalog;

use App\Models\Slug;
use App\Traits\HasImageFile;
use Astrotomic\Translatable\Contracts\Translatable as TranslatableContract;
use Astrotomic\Translatable\Translatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Post extends Model implements TranslatableContract
{
    use HasFactory, HasImageFile, SoftDeletes, Translatable;

    public const PUBLICATION_STATUS_DRAFT = 'draft';

    public const PUBLICATION_STATUS_SCHEDULED = 'scheduled';

    public const PUBLICATION_STATUS_PUBLISHED = 'published';

    protected $table = 'posts';

    protected $fillable = [
        'category_id',
        'photo',
        'type',
        'status',
        'order',
        'hit_viewer',
        'publication_status',
        'published_at',
    ];

    protected $casts = [
        'status' => 'integer',
        'published_at' => 'datetime',
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
        return config('image.path.post', null);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id');
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
}
