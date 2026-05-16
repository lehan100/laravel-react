<?php

namespace App\Models\Settings;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdministrativeRegion extends Model
{
    use HasFactory;

    protected $table = 'administrative_regions';

    public $timestamps = false;

    protected $fillable = [
        'id',
        'name',
        'name_en',
        'code_name',
        'code_name_en',
    ];

    protected $casts = [
        'id' => 'integer',
    ];
}
