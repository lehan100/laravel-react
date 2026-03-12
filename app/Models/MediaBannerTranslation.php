<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MediaBannerTranslation extends Model
{
    use HasFactory;


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
}
