import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Ai\PostAiController::translate
* @see app/Http/Controllers/Ai/PostAiController.php:119
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
* @see app/Http/Controllers/Ai/PostAiController.php:119
* @route '/admin123/post/ai-translate'
*/
translate.url = (options?: RouteQueryOptions) => {
    return translate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Ai\PostAiController::translate
* @see app/Http/Controllers/Ai/PostAiController.php:119
* @route '/admin123/post/ai-translate'
*/
translate.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: translate.url(options),
    method: 'post',
})

const ai = {
    translate: Object.assign(translate, translate),
}

export default ai