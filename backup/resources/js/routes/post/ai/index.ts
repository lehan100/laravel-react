import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Ai\PostAiController::suggestContent
* @see app/Http/Controllers/Ai/PostAiController.php:15
* @route '/admin123/post/ai-suggest-content'
*/
export const suggestContent = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: suggestContent.url(options),
    method: 'post',
})

suggestContent.definition = {
    methods: ["post"],
    url: '/admin123/post/ai-suggest-content',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Ai\PostAiController::suggestContent
* @see app/Http/Controllers/Ai/PostAiController.php:15
* @route '/admin123/post/ai-suggest-content'
*/
suggestContent.url = (options?: RouteQueryOptions) => {
    return suggestContent.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Ai\PostAiController::suggestContent
* @see app/Http/Controllers/Ai/PostAiController.php:15
* @route '/admin123/post/ai-suggest-content'
*/
suggestContent.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: suggestContent.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Ai\PostAiController::suggestSeo
* @see app/Http/Controllers/Ai/PostAiController.php:62
* @route '/admin123/post/ai-suggest-seo'
*/
export const suggestSeo = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: suggestSeo.url(options),
    method: 'post',
})

suggestSeo.definition = {
    methods: ["post"],
    url: '/admin123/post/ai-suggest-seo',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Ai\PostAiController::suggestSeo
* @see app/Http/Controllers/Ai/PostAiController.php:62
* @route '/admin123/post/ai-suggest-seo'
*/
suggestSeo.url = (options?: RouteQueryOptions) => {
    return suggestSeo.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Ai\PostAiController::suggestSeo
* @see app/Http/Controllers/Ai/PostAiController.php:62
* @route '/admin123/post/ai-suggest-seo'
*/
suggestSeo.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: suggestSeo.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Ai\PostAiController::translate
* @see app/Http/Controllers/Ai/PostAiController.php:118
* @route '/admin123/post/ai-translate'
*/
export const translate = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: translate.url(options),
    method: 'post',
})

translate.definition = {
    methods: ["post"],
    url: '/admin123/post/ai-translate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Ai\PostAiController::translate
* @see app/Http/Controllers/Ai/PostAiController.php:118
* @route '/admin123/post/ai-translate'
*/
translate.url = (options?: RouteQueryOptions) => {
    return translate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Ai\PostAiController::translate
* @see app/Http/Controllers/Ai/PostAiController.php:118
* @route '/admin123/post/ai-translate'
*/
translate.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: translate.url(options),
    method: 'post',
})

const ai = {
    suggestContent: Object.assign(suggestContent, suggestContent),
    suggestSeo: Object.assign(suggestSeo, suggestSeo),
    translate: Object.assign(translate, translate),
}

export default ai