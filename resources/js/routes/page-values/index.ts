import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\PageManager\PageController::index
* @see app/Http/Controllers/Admin/PageManager/PageController.php:24
* @route '/admin123/page-values'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin123/page-values',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PageManager\PageController::index
* @see app/Http/Controllers/Admin/PageManager/PageController.php:24
* @route '/admin123/page-values'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PageManager\PageController::index
* @see app/Http/Controllers/Admin/PageManager/PageController.php:24
* @route '/admin123/page-values'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PageManager\PageController::index
* @see app/Http/Controllers/Admin/PageManager/PageController.php:24
* @route '/admin123/page-values'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

const pageValues = {
    index: Object.assign(index, index),
}

export default pageValues