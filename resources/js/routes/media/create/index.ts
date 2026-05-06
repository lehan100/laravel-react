import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\Media\TinyMCEController::folder
* @see app/Http/Controllers/Admin/Media/TinyMCEController.php:88
* @route '/admin123/media-create-folder'
*/
export const folder = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: folder.url(options),
    method: 'post',
})

folder.definition = {
    methods: ["post"],
    url: '/admin123/media-create-folder',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Media\TinyMCEController::folder
* @see app/Http/Controllers/Admin/Media/TinyMCEController.php:88
* @route '/admin123/media-create-folder'
*/
folder.url = (options?: RouteQueryOptions) => {
    return folder.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Media\TinyMCEController::folder
* @see app/Http/Controllers/Admin/Media/TinyMCEController.php:88
* @route '/admin123/media-create-folder'
*/
folder.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: folder.url(options),
    method: 'post',
})

const create = {
    folder: Object.assign(folder, folder),
}

export default create