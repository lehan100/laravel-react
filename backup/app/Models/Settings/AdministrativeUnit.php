<?php

namespace App\Models\Settings;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdministrativeUnit extends Model
{
    use HasFactory;

    protected $table = 'administrative_units';

    public $timestamps = false;

    protected $fillable = [
        'id',
        'full_name',
        'full_name_en',
        'short_name',
        'short_name_en',
        'code_name',
        'code_name_en',
    ];

    protected $casts = [
        'id' => 'integer',
    ];
}
