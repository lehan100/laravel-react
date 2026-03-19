<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Slug extends Model
{
    protected $table = 'slugs';

    protected $fillable = [
        'key', 
        'locale', 
        'sluggable_id', 
        'sluggable_type', 
        'is_default'
    ];

    
    public function sluggable(): MorphTo
    {
        return $this->morphTo();
    }
}
