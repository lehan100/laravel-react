<?php

namespace App\Models\Media;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HasImageFile;

class MediaBannerTranslation extends Model
{
    use HasFactory, HasImageFile;


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
