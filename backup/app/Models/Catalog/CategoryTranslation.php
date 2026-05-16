<?php

namespace App\Models\Catalog;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CategoryTranslation extends Model
{
    use HasFactory,SoftDeletes;

    public $timestamps = true;

    protected $table = 'category_translations';

    protected $fillable = [
        'category_id',
        'locale',
        'name',
        'description',
        'content',
        'seo_title',
        'seo_keyword',
        'seo_description',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }
}
