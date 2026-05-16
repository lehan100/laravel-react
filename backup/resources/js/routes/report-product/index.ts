import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\Report\ReportProductController::index
* @see app/Http/Controllers/Admin/Report/ReportProductController.php:14
* @route '/admin123/report-product'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin123/report-product',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Report\ReportProductController::index
* @see app/Http/Controllers/Admin/Report/ReportProductController.php:14
* @route '/admin123/report-product'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Report\ReportProductController::index
* @see app/Http/Controllers/Admin/Report/ReportProductController.php:14
* @route '/admin123/report-product'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Report\ReportProductController::index
* @see app/Http/Controllers/Admin/Report/ReportProductController.php:14
* @route '/admin123/report-product'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Report\ReportProductController::analyze
* @see app/Http/Controllers/Admin/Report/ReportProductController.php:22
* @route '/admin123/report-product/analyze'
*/
export const analyze = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: analyze.url(options),
    method: 'post',
})

analyze.definition = {
    methods: ["post"],
    url: '/admin123/report-product/analyze',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Report\ReportProductController::analyze
* @see app/Http/Controllers/Admin/Report/ReportProductController.php:22
* @route '/admin123/report-product/analyze'
*/
analyze.url = (options?: RouteQueryOptions) => {
    return analyze.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Report\ReportProductController::analyze
* @see app/Http/Controllers/Admin/Report/ReportProductController.php:22
* @route '/admin123/report-product/analyze'
*/
analyze.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: analyze.url(options),
    method: 'post',
})

const reportProduct = {
    index: Object.assign(index, index),
    analyze: Object.assign(analyze, analyze),
}

export default reportProduct