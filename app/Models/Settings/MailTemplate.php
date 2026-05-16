<?php

namespace App\Models\Settings;

use Astrotomic\Translatable\Contracts\Translatable as TranslatableContract;
use Astrotomic\Translatable\Translatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MailTemplate extends Model implements TranslatableContract
{
    use HasFactory, SoftDeletes, Translatable;

    protected $table = 'mail_templates';

    protected $fillable = [
        'key',
        'module',
        'fallback_locale',
        'variables',
        'is_active',
    ];

    public $translationModel = MailTemplateTranslation::class;

    public $translatedAttributes = [
        'name',
        'subject',
        'body_html',
    ];

    protected $casts = [
        'variables' => 'array',
        'is_active' => 'boolean',
    ];
}
