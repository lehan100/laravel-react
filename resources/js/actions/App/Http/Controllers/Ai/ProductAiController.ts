import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Ai\ProductAiController::suggestContent
* @see app/Http/Controllers/Ai/ProductAiController.php:13
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
* @see app/Http/Controllers/Ai/ProductAiController.php:13
* @route '/admin123/product/ai-suggest-content'
*/
suggestContent.url = (options?: RouteQueryOptions) => {
    return suggestContent.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Ai\ProductAiController::suggestContent
* @see app/Http/Controllers/Ai/ProductAiController.php:13
* @route '/admin123/product/ai-suggest-content'
*/
suggestContent.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: suggestContent.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Ai\ProductAiController::suggestSeo
* @see app/Http/Controllers/Ai/ProductAiController.php:60
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
* @see app/Http/Controllers/Ai/ProductAiController.php:60
* @route '/admin123/product/ai-suggest-seo'
*/
suggestSeo.url = (options?: RouteQueryOptions) => {
    return suggestSeo.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Ai\ProductAiController::suggestSeo
* @see app/Http/Controllers/Ai/ProductAiController.php:60
* @route '/admin123/product/ai-suggest-seo'
*/
suggestSeo.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: suggestSeo.url(options),
    method: 'post',
})

const ProductAiController = { suggestContent, suggestSeo }

export default ProductAiController