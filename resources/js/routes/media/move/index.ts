import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\Media\TinyMCEController::file
* @see app/Http/Controllers/Admin/Media/TinyMCEController.php:133
* @route '/admin123/media-move-file'
*/
export const file = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: file.url(options),
    method: 'post',
})

file.definition = {
    methods: ["post"],
    url: '/admin123/media-move-file',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Media\TinyMCEController::file
* @see app/Http/Controllers/Admin/Media/TinyMCEController.php:133
* @route '/admin123/media-move-file'
*/
file.url = (options?: RouteQueryOptions) => {
    return file.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Media\TinyMCEController::file
* @see app/Http/Controllers/Admin/Media/TinyMCEController.php:133
* @route '/admin123/media-move-file'
*/
file.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: file.url(options),
    method: 'post',
})

const move = {
    file: Object.assign(file, file),
}

export default move