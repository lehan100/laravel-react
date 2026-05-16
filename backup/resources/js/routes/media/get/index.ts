import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\Media\TinyMCEController::images
* @see app/Http/Controllers/Admin/Media/TinyMCEController.php:40
* @route '/admin123/media-get-images'
*/
export const images = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: images.url(options),
    method: 'get',
})

images.definition = {
    methods: ["get","head"],
    url: '/admin123/media-get-images',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Media\TinyMCEController::images
* @see app/Http/Controllers/Admin/Media/TinyMCEController.php:40
* @route '/admin123/media-get-images'
*/
images.url = (options?: RouteQueryOptions) => {
    return images.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Media\TinyMCEController::images
* @see app/Http/Controllers/Admin/Media/TinyMCEController.php:40
* @route '/admin123/media-get-images'
*/
images.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: images.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Media\TinyMCEController::images
* @see app/Http/Controllers/Admin/Media/TinyMCEController.php:40
* @route '/admin123/media-get-images'
*/
images.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: images.url(options),
    method: 'head',
})

const get = {
    images: Object.assign(images, images),
}

export default get