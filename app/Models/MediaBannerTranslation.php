<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HasImageFile;
use Illuminate\Database\Eloquent\SoftDeletes;

class MediaBannerTranslation extends Model
{
    use HasFactory, SoftDeletes, HasImageFile;


    public $timestamps = true;

    protected $table = 'media_banner_translations';


    protected $fillable = [
        'media_banner_id',
        'locale',
        'name',
        'photo',
        'alias_link',
        'description',
        'content'
    ];
    protected $imageColumn = 'photo';
    public function getImagePath()
    {
        return config('image.path.photo', null);
    }
}
