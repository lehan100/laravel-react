<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Category;
class CategoryTranslation extends Model
{
    use HasFactory;


    public $timestamps = true;

    protected $table = 'category_translations';


    protected $fillable = [
        'category_id',
        'locale',
        'name',
        'description',
        'content'
    ];
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }
}
