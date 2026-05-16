import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\Dashboard\DashboardController::index
* @see app/Http/Controllers/Admin/Dashboard/DashboardController.php:19
* @route '/admin123/dashboard'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin123/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Dashboard\DashboardController::index
* @see app/Http/Controllers/Admin/Dashboard/DashboardController.php:19
* @route '/admin123/dashboard'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Dashboard\DashboardController::index
* @see app/Http/Controllers/Admin/Dashboard/DashboardController.php:19
* @route '/admin123/dashboard'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Dashboard\DashboardController::index
* @see app/Http/Controllers/Admin/Dashboard/DashboardController.php:19
* @route '/admin123/dashboard'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

const DashboardController = { index }

export default DashboardController