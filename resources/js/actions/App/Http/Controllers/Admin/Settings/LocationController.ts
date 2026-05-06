import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\Settings\LocationController::index
* @see app/Http/Controllers/Admin/Settings/LocationController.php:24
* @route '/admin123/locations'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin123/locations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Settings\LocationController::index
* @see app/Http/Controllers/Admin/Settings/LocationController.php:24
* @route '/admin123/locations'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Settings\LocationController::index
* @see app/Http/Controllers/Admin/Settings/LocationController.php:24
* @route '/admin123/locations'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Settings\LocationController::index
* @see app/Http/Controllers/Admin/Settings/LocationController.php:24
* @route '/admin123/locations'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Settings\LocationController::show
* @see app/Http/Controllers/Admin/Settings/LocationController.php:42
* @route '/admin123/locations/{province}'
*/
export const show = (args: { province: string | { code: string } } | [province: string | { code: string } ] | string | { code: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin123/locations/{province}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Settings\LocationController::show
* @see app/Http/Controllers/Admin/Settings/LocationController.php:42
* @route '/admin123/locations/{province}'
*/
show.url = (args: { province: string | { code: string } } | [province: string | { code: string } ] | string | { code: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { province: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'code' in args) {
        args = { province: args.code }
    }

    if (Array.isArray(args)) {
        args = {
            province: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        province: typeof args.province === 'object'
        ? args.province.code
        : args.province,
    }

    return show.definition.url
            .replace('{province}', parsedArgs.province.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Settings\LocationController::show
* @see app/Http/Controllers/Admin/Settings/LocationController.php:42
* @route '/admin123/locations/{province}'
*/
show.get = (args: { province: string | { code: string } } | [province: string | { code: string } ] | string | { code: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Settings\LocationController::show
* @see app/Http/Controllers/Admin/Settings/LocationController.php:42
* @route '/admin123/locations/{province}'
*/
show.head = (args: { province: string | { code: string } } | [province: string | { code: string } ] | string | { code: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

const LocationController = { index, show }

export default LocationController