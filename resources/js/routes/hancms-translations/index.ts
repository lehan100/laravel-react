import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\Settings\HancmsTranslationController::index
* @see app/Http/Controllers/Admin/Settings/HancmsTranslationController.php:23
* @route '/admin123/hancms-translations'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin123/hancms-translations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Settings\HancmsTranslationController::index
* @see app/Http/Controllers/Admin/Settings/HancmsTranslationController.php:23
* @route '/admin123/hancms-translations'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Settings\HancmsTranslationController::index
* @see app/Http/Controllers/Admin/Settings/HancmsTranslationController.php:23
* @route '/admin123/hancms-translations'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Settings\HancmsTranslationController::index
* @see app/Http/Controllers/Admin/Settings/HancmsTranslationController.php:23
* @route '/admin123/hancms-translations'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Settings\HancmsTranslationController::store
* @see app/Http/Controllers/Admin/Settings/HancmsTranslationController.php:36
* @route '/admin123/hancms-translations'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin123/hancms-translations',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Settings\HancmsTranslationController::store
* @see app/Http/Controllers/Admin/Settings/HancmsTranslationController.php:36
* @route '/admin123/hancms-translations'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Settings\HancmsTranslationController::store
* @see app/Http/Controllers/Admin/Settings/HancmsTranslationController.php:36
* @route '/admin123/hancms-translations'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

const hancmsTranslations = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
}

export default hancmsTranslations