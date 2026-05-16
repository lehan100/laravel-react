import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Ai\ProductAiController::suggestContent
* @see app/Http/Controllers/Ai/ProductAiController.php:14
* @route '/admin123/product/ai-suggest-content'
*/
export const suggestContent = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: suggestContent.url(options),
    method: 'post',
})

suggestContent.definition = {
    methods: ["post"],
    url: '/admin123/product/ai-suggest-content',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Ai\ProductAiController::suggestContent
* @see app/Http/Controllers/Ai/ProductAiController.php:14
* @route '/admin123/product/ai-suggest-content'
*/
suggestContent.url = (options?: RouteQueryOptions) => {
    return suggestContent.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Ai\ProductAiController::suggestContent
* @see app/Http/Controllers/Ai/ProductAiController.php:14
* @route '/admin123/product/ai-suggest-content'
*/
suggestContent.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: suggestContent.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Ai\ProductAiController::suggestSeo
* @see app/Http/Controllers/Ai/ProductAiController.php:61
* @route '/admin123/product/ai-suggest-seo'
*/
export const suggestSeo = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: suggestSeo.url(options),
    method: 'post',
})

suggestSeo.definition = {
    methods: ["post"],
    url: '/admin123/product/ai-suggest-seo',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Ai\ProductAiController::suggestSeo
* @see app/Http/Controllers/Ai/ProductAiController.php:61
* @route '/admin123/product/ai-suggest-seo'
*/
suggestSeo.url = (options?: RouteQueryOptions) => {
    return suggestSeo.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Ai\ProductAiController::suggestSeo
* @see app/Http/Controllers/Ai/ProductAiController.php:61
* @route '/admin123/product/ai-suggest-seo'
*/
suggestSeo.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: suggestSeo.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Ai\ProductAiController::analyzeSeo
* @see app/Http/Controllers/Ai/ProductAiController.php:117
* @route '/admin123/product/ai-analyze-seo'
*/
export const analyzeSeo = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: analyzeSeo.url(options),
    method: 'post',
})

analyzeSeo.definition = {
    methods: ["post"],
    url: '/admin123/product/ai-analyze-seo',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Ai\ProductAiController::analyzeSeo
* @see app/Http/Controllers/Ai/ProductAiController.php:117
* @route '/admin123/product/ai-analyze-seo'
*/
analyzeSeo.url = (options?: RouteQueryOptions) => {
    return analyzeSeo.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Ai\ProductAiController::analyzeSeo
* @see app/Http/Controllers/Ai/ProductAiController.php:117
* @route '/admin123/product/ai-analyze-seo'
*/
analyzeSeo.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: analyzeSeo.url(options),
    method: 'post',
})

const ai = {
    suggestContent: Object.assign(suggestContent, suggestContent),
    suggestSeo: Object.assign(suggestSeo, suggestSeo),
    analyzeSeo: Object.assign(analyzeSeo, analyzeSeo),
}

export default ai