import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Ai\LocaleTranslateController::translate
* @see app/Http/Controllers/Ai/LocaleTranslateController.php:17
* @route '/admin123/ai/translate'
*/
export const translate = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: translate.url(options),
    method: 'post',
})

translate.definition = {
    methods: ["post"],
    url: '/admin123/ai/translate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Ai\LocaleTranslateController::translate
* @see app/Http/Controllers/Ai/LocaleTranslateController.php:17
* @route '/admin123/ai/translate'
*/
translate.url = (options?: RouteQueryOptions) => {
    return translate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Ai\LocaleTranslateController::translate
* @see app/Http/Controllers/Ai/LocaleTranslateController.php:17
* @route '/admin123/ai/translate'
*/
translate.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: translate.url(options),
    method: 'post',
})

const LocaleTranslateController = { translate }

export default LocaleTranslateController