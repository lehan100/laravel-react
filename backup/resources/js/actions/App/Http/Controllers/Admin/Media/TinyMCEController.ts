import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\Media\TinyMCEController::uploadTinyMCE
* @see app/Http/Controllers/Admin/Media/TinyMCEController.php:15
* @route '/admin123/upload-tinymce'
*/
export const uploadTinyMCE = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadTinyMCE.url(options),
    method: 'post',
})

uploadTinyMCE.definition = {
    methods: ["post"],
    url: '/admin123/upload-tinymce',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Media\TinyMCEController::uploadTinyMCE
* @see app/Http/Controllers/Admin/Media/TinyMCEController.php:15
* @route '/admin123/upload-tinymce'
*/
uploadTinyMCE.url = (options?: RouteQueryOptions) => {
    return uploadTinyMCE.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Media\TinyMCEController::uploadTinyMCE
* @see app/Http/Controllers/Admin/Media/TinyMCEController.php:15
* @route '/admin123/upload-tinymce'
*/
uploadTinyMCE.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadTinyMCE.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\Media\TinyMCEController::getImages
* @see app/Http/Controllers/Admin/Media/TinyMCEController.php:40
* @route '/admin123/media-get-images'
*/
export const getImages = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getImages.url(options),
    method: 'get',
})

getImages.definition = {
    methods: ["get","head"],
    url: '/admin123/media-get-images',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Media\TinyMCEController::getImages
* @see app/Http/Controllers/Admin/Media/TinyMCEController.php:40
* @route '/admin123/media-get-images'
*/
getImages.url = (options?: RouteQueryOptions) => {
    return getImages.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Media\TinyMCEController::getImages
* @see app/Http/Controllers/Admin/Media/TinyMCEController.php:40
* @route '/admin123/media-get-images'
*/
getImages.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getImages.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Media\TinyMCEController::getImages
* @see app/Http/Controllers/Admin/Media/TinyMCEController.php:40
* @route '/admin123/media-get-images'
*/
getImages.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getImages.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Media\TinyMCEController::createFolder
* @see app/Http/Controllers/Admin/Media/TinyMCEController.php:97
* @route '/admin123/media-create-folder'
*/
export const createFolder = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createFolder.url(options),
    method: 'post',
})

createFolder.definition = {
    methods: ["post"],
    url: '/admin123/media-create-folder',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Media\TinyMCEController::createFolder
* @see app/Http/Controllers/Admin/Media/TinyMCEController.php:97
* @route '/admin123/media-create-folder'
*/
createFolder.url = (options?: RouteQueryOptions) => {
    return createFolder.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Media\TinyMCEController::createFolder
* @see app/Http/Controllers/Admin/Media/TinyMCEController.php:97
* @route '/admin123/media-create-folder'
*/
createFolder.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createFolder.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\Media\TinyMCEController::moveFile
* @see app/Http/Controllers/Admin/Media/TinyMCEController.php:133
* @route '/admin123/media-move-file'
*/
export const moveFile = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: moveFile.url(options),
    method: 'post',
})

moveFile.definition = {
    methods: ["post"],
    url: '/admin123/media-move-file',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Media\TinyMCEController::moveFile
* @see app/Http/Controllers/Admin/Media/TinyMCEController.php:133
* @route '/admin123/media-move-file'
*/
moveFile.url = (options?: RouteQueryOptions) => {
    return moveFile.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Media\TinyMCEController::moveFile
* @see app/Http/Controllers/Admin/Media/TinyMCEController.php:133
* @route '/admin123/media-move-file'
*/
moveFile.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: moveFile.url(options),
    method: 'post',
})

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

const TinyMCEController = { uploadTinyMCE, getImages, createFolder, moveFile, rename, deleteMethod, delete: deleteMethod }

export default TinyMCEController