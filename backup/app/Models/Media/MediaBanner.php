<?php

namespace App\Models\Media;

use Astrotomic\Translatable\Contracts\Translatable as TranslatableContract;
use Astrotomic\Translatable\Translatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class MediaBanner extends Model implements TranslatableContract
{
    use HasFactory, SoftDeletes, Translatable;

    protected $table = 'media_banners';

    public $translationModel = MediaBannerTranslation::class;

    protected $fillable = [
        'status',
        'order',
    ];

    public $translatedAttributes = [
        'name',
        'photo',
        'alias_link',
        'description',
        'content',
    ];

    public function positions(): BelongsToMany
    {
        return $this->belongsToMany(
            MediaPosition::class,
            'media_banner_position',
            'banner_id',
            'position_id'
        )->withTimestamps();
    }

    protected static function booted()
    {
        static::deleting(function ($model) {
            $model->translations()->get()->each(function ($translation) {
                $translation->forceDelete();
            });
        });
    }
}
