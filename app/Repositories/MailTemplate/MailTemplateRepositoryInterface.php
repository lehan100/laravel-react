<?php

namespace App\Repositories\MailTemplate;

use App\Models\Settings\MailTemplate;
use App\Repositories\EloquentRepositoryInterface;

interface MailTemplateRepositoryInterface extends EloquentRepositoryInterface
{
    public function findByKey(string $key): ?MailTemplate;
}
