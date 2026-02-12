<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Astrotomic\Translatable\Contracts\Translatable as TranslatableContract;
use Astrotomic\Translatable\Translatable;

class MediaBanner extends Model implements TranslatableContract
{
    use HasFactory, SoftDeletes, Translatable;

    protected $table = 'media_banners';

    protected $fillable = [
        'alias_link',
        'photo',
        'status',
        'order',
    ];
    public $translatedAttributes = [
        'name',
        'description',
        'content'
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
}
