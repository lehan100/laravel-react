import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\Report\ReportInventoryController::index
* @see app/Http/Controllers/Admin/Report/ReportInventoryController.php:14
* @route '/admin123/report-inventory'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin123/report-inventory',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Report\ReportInventoryController::index
* @see app/Http/Controllers/Admin/Report/ReportInventoryController.php:14
* @route '/admin123/report-inventory'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Report\ReportInventoryController::index
* @see app/Http/Controllers/Admin/Report/ReportInventoryController.php:14
* @route '/admin123/report-inventory'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Report\ReportInventoryController::index
* @see app/Http/Controllers/Admin/Report/ReportInventoryController.php:14
* @route '/admin123/report-inventory'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Report\ReportInventoryController::analyze
* @see app/Http/Controllers/Admin/Report/ReportInventoryController.php:22
* @route '/admin123/report-inventory/analyze'
*/
export const analyze = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: analyze.url(options),
    method: 'post',
})

analyze.definition = {
    methods: ["post"],
    url: '/admin123/report-inventory/analyze',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Report\ReportInventoryController::analyze
* @see app/Http/Controllers/Admin/Report/ReportInventoryController.php:22
* @route '/admin123/report-inventory/analyze'
*/
analyze.url = (options?: RouteQueryOptions) => {
    return analyze.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Report\ReportInventoryController::analyze
* @see app/Http/Controllers/Admin/Report/ReportInventoryController.php:22
* @route '/admin123/report-inventory/analyze'
*/
analyze.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: analyze.url(options),
    method: 'post',
})

const ReportInventoryController = { index, analyze }

export default ReportInventoryController