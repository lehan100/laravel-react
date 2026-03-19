<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Route;
use Spatie\Permission\Models\Permission;

class CreateRoutePermissionsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'permission:create-permission-routes';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a permission routes.';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $routes = Route::getRoutes();

        foreach ($routes as $route) {
            $routeName = $route->getName();

            if (!empty($routeName)) {
                $isApi = str_starts_with($routeName, 'api.') || in_array('api', $route->gatherMiddleware());
                $guard = $isApi ? 'api' : 'web';

                $permission = Permission::where('name', $routeName)
                    ->where('guard_name', $guard)
                    ->first();

                if (is_null($permission)) {
                    Permission::create([
                        'name' => $routeName,
                        'guard_name' => $guard
                    ]);
                    $this->line("<info>Created:</info> {$routeName} [{$guard}]");
                }
            }
        }

        $this->info('Permission routes added successfully.');
    }
}
