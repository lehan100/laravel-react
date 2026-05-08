import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
import upload from './upload'
import get from './get'
import create from './create'
import move from './move'
/**
* @see \App\Http\Controllers\Admin\Media\TinyMCEController::rename
* @see app/Http/Controllers/Admin/Media/TinyMCEController.php:157
* @route '/admin123/media-rename'
*/
export const rename = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rename.url(options),
    method: 'post',
})

rename.definition = {
    methods: ["post"],
    url: '/admin123/media-rename',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Media\TinyMCEController::rename
* @see app/Http/Controllers/Admin/Media/TinyMCEController.php:157
* @route '/admin123/media-rename'
*/
rename.url = (options?: RouteQueryOptions) => {
    return rename.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Media\TinyMCEController::rename
* @see app/Http/Controllers/Admin/Media/TinyMCEController.php:157
* @route '/admin123/media-rename'
*/
rename.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rename.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\Media\TinyMCEController::deleteMethod
* @see app/Http/Controllers/Admin/Media/TinyMCEController.php:227
* @route '/admin123/media-delete'
*/
export const deleteMethod = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: deleteMethod.url(options),
    method: 'post',
})

deleteMethod.definition = {
    methods: ["post"],
    url: '/admin123/media-delete',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Media\TinyMCEController::deleteMethod
* @see app/Http/Controllers/Admin/Media/TinyMCEController.php:227
* @route '/admin123/media-delete'
*/
deleteMethod.url = (options?: RouteQueryOptions) => {
    return deleteMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Media\TinyMCEController::deleteMethod
* @see app/Http/Controllers/Admin/Media/TinyMCEController.php:227
* @route '/admin123/media-delete'
*/
deleteMethod.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: deleteMethod.url(options),
    method: 'post',
})

const media = {
    upload: Object.assign(upload, upload),
    get: Object.assign(get, get),
    create: Object.assign(create, create),
    move: Object.assign(move, move),
    rename: Object.assign(rename, rename),
    delete: Object.assign(deleteMethod, deleteMethod),
}

export default media