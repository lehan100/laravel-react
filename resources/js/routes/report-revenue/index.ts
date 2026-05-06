import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\Report\ReportRevenueController::index
* @see app/Http/Controllers/Admin/Report/ReportRevenueController.php:14
* @route '/admin123/report-revenue'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin123/report-revenue',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Report\ReportRevenueController::index
* @see app/Http/Controllers/Admin/Report/ReportRevenueController.php:14
* @route '/admin123/report-revenue'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Report\ReportRevenueController::index
* @see app/Http/Controllers/Admin/Report/ReportRevenueController.php:14
* @route '/admin123/report-revenue'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Report\ReportRevenueController::index
* @see app/Http/Controllers/Admin/Report/ReportRevenueController.php:14
* @route '/admin123/report-revenue'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Report\ReportRevenueController::analyze
* @see app/Http/Controllers/Admin/Report/ReportRevenueController.php:22
* @route '/admin123/report-revenue/analyze'
*/
export const analyze = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: analyze.url(options),
    method: 'post',
})

analyze.definition = {
    methods: ["post"],
    url: '/admin123/report-revenue/analyze',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Report\ReportRevenueController::analyze
* @see app/Http/Controllers/Admin/Report/ReportRevenueController.php:22
* @route '/admin123/report-revenue/analyze'
*/
analyze.url = (options?: RouteQueryOptions) => {
    return analyze.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Report\ReportRevenueController::analyze
* @see app/Http/Controllers/Admin/Report/ReportRevenueController.php:22
* @route '/admin123/report-revenue/analyze'
*/
analyze.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: analyze.url(options),
    method: 'post',
})

const reportRevenue = {
    index: Object.assign(index, index),
    analyze: Object.assign(analyze, analyze),
}

export default reportRevenue