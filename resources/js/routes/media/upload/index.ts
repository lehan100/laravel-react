import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\Media\TinyMCEController::tinymce
* @see app/Http/Controllers/Admin/Media/TinyMCEController.php:12
* @route '/admin123/upload-tinymce'
*/
export const tinymce = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: tinymce.url(options),
    method: 'post',
})

tinymce.definition = {
    methods: ["post"],
    url: '/admin123/upload-tinymce',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Media\TinyMCEController::tinymce
* @see app/Http/Controllers/Admin/Media/TinyMCEController.php:12
* @route '/admin123/upload-tinymce'
*/
tinymce.url = (options?: RouteQueryOptions) => {
    return tinymce.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Media\TinyMCEController::tinymce
* @see app/Http/Controllers/Admin/Media/TinyMCEController.php:12
* @route '/admin123/upload-tinymce'
*/
tinymce.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: tinymce.url(options),
    method: 'post',
})

const upload = {
    tinymce: Object.assign(tinymce, tinymce),
}

export default upload