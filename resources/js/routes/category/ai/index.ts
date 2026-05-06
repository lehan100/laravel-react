import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Ai\CategoryAiController::suggestSeo
* @see app/Http/Controllers/Ai/CategoryAiController.php:14
* @route '/admin123/category/ai-suggest-seo'
*/
export const suggestSeo = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: suggestSeo.url(options),
    method: 'post',
})

suggestSeo.definition = {
    methods: ["post"],
    url: '/admin123/category/ai-suggest-seo',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Ai\CategoryAiController::suggestSeo
* @see app/Http/Controllers/Ai/CategoryAiController.php:14
* @route '/admin123/category/ai-suggest-seo'
*/
suggestSeo.url = (options?: RouteQueryOptions) => {
    return suggestSeo.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Ai\CategoryAiController::suggestSeo
* @see app/Http/Controllers/Ai/CategoryAiController.php:14
* @route '/admin123/category/ai-suggest-seo'
*/
suggestSeo.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: suggestSeo.url(options),
    method: 'post',
})

const ai = {
    suggestSeo: Object.assign(suggestSeo, suggestSeo),
}

export default ai