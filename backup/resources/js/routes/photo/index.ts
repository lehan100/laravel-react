import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ImageUploadController::upload
* @see app/Http/Controllers/ImageUploadController.php:22
* @route '/photo-upload'
*/
export const upload = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: upload.url(options),
    method: 'post',
})

upload.definition = {
    methods: ["post"],
    url: '/photo-upload',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ImageUploadController::upload
* @see app/Http/Controllers/ImageUploadController.php:22
* @route '/photo-upload'
*/
upload.url = (options?: RouteQueryOptions) => {
    return upload.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ImageUploadController::upload
* @see app/Http/Controllers/ImageUploadController.php:22
* @route '/photo-upload'
*/
upload.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: upload.url(options),
    method: 'post',
})

const photo = {
    upload: Object.assign(upload, upload),
}

export default photo