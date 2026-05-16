import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\Report\ReportPromotionController::index
* @see app/Http/Controllers/Admin/Report/ReportPromotionController.php:14
* @route '/admin123/report-promotion'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin123/report-promotion',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Report\ReportPromotionController::index
* @see app/Http/Controllers/Admin/Report/ReportPromotionController.php:14
* @route '/admin123/report-promotion'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Report\ReportPromotionController::index
* @see app/Http/Controllers/Admin/Report/ReportPromotionController.php:14
* @route '/admin123/report-promotion'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Report\ReportPromotionController::index
* @see app/Http/Controllers/Admin/Report/ReportPromotionController.php:14
* @route '/admin123/report-promotion'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Report\ReportPromotionController::analyze
* @see app/Http/Controllers/Admin/Report/ReportPromotionController.php:22
* @route '/admin123/report-promotion/analyze'
*/
export const analyze = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: analyze.url(options),
    method: 'post',
})

analyze.definition = {
    methods: ["post"],
    url: '/admin123/report-promotion/analyze',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Report\ReportPromotionController::analyze
* @see app/Http/Controllers/Admin/Report/ReportPromotionController.php:22
* @route '/admin123/report-promotion/analyze'
*/
analyze.url = (options?: RouteQueryOptions) => {
    return analyze.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Report\ReportPromotionController::analyze
* @see app/Http/Controllers/Admin/Report/ReportPromotionController.php:22
* @route '/admin123/report-promotion/analyze'
*/
analyze.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: analyze.url(options),
    method: 'post',
})

const ReportPromotionController = { index, analyze }

export default ReportPromotionController