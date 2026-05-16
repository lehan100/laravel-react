<?php

namespace App\Models\Settings;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MailTemplateTranslation extends Model
{
    use HasFactory;

    public $timestamps = true;

    protected $table = 'mail_template_translations';

    protected $fillable = [
        'mail_template_id',
        'locale',
        'name',
        'subject',
        'body_html',
    ];

    public function mailTemplate(): BelongsTo
    {
        return $this->belongsTo(MailTemplate::class, 'mail_template_id');
    }
}
