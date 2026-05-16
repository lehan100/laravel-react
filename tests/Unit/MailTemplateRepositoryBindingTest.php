<?php

namespace Tests\Unit;

use App\Repositories\MailTemplate\MailTemplateEloquentRepository;
use App\Repositories\MailTemplate\MailTemplateRepositoryInterface;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class MailTemplateRepositoryBindingTest extends TestCase
{
    #[Test]
    public function it_binds_the_mail_template_repository_interface_to_the_eloquent_implementation(): void
    {
        $repository = app(MailTemplateRepositoryInterface::class);

        $this->assertInstanceOf(MailTemplateEloquentRepository::class, $repository);
    }
}
