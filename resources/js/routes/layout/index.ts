import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\Settings\LayoutController::index
* @see app/Http/Controllers/Admin/Settings/LayoutController.php:30
* @route '/admin123/layout'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin123/layout',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Settings\LayoutController::index
* @see app/Http/Controllers/Admin/Settings/LayoutController.php:30
* @route '/admin123/layout'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Settings\LayoutController::index
* @see app/Http/Controllers/Admin/Settings/LayoutController.php:30
* @route '/admin123/layout'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Settings\LayoutController::index
* @see app/Http/Controllers/Admin/Settings/LayoutController.php:30
* @route '/admin123/layout'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Settings\LayoutController::store
* @see app/Http/Controllers/Admin/Settings/LayoutController.php:48
* @route '/admin123/layout/store'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin123/layout/store',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Settings\LayoutController::store
* @see app/Http/Controllers/Admin/Settings/LayoutController.php:48
* @route '/admin123/layout/store'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Settings\LayoutController::store
* @see app/Http/Controllers/Admin/Settings/LayoutController.php:48
* @route '/admin123/layout/store'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

const layout = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
}

export default layout