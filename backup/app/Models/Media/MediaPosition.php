<?php

namespace App\Models\Media;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class MediaPosition extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'media_positions';

    protected $fillable = [
        'name',
        'code',
        'status',
    ];

    public function banners(): BelongsToMany
    {
        return $this->belongsToMany(
            MediaBanner::class,
            'media_banner_position',
            'position_id',
            'banner_id'
        )->withTimestamps();
    }
}
