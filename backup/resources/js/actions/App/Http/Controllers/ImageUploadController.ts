import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ImageUploadController::storePhoto
* @see app/Http/Controllers/ImageUploadController.php:22
* @route '/photo-upload'
*/
export const storePhoto = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePhoto.url(options),
    method: 'post',
})

storePhoto.definition = {
    methods: ["post"],
    url: '/photo-upload',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ImageUploadController::storePhoto
* @see app/Http/Controllers/ImageUploadController.php:22
* @route '/photo-upload'
*/
storePhoto.url = (options?: RouteQueryOptions) => {
    return storePhoto.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ImageUploadController::storePhoto
* @see app/Http/Controllers/ImageUploadController.php:22
* @route '/photo-upload'
*/
storePhoto.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePhoto.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ImageUploadController::storeCategory
* @see app/Http/Controllers/ImageUploadController.php:52
* @route '/category-upload'
*/
export const storeCategory = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeCategory.url(options),
    method: 'post',
})

storeCategory.definition = {
    methods: ["post"],
    url: '/category-upload',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ImageUploadController::storeCategory
* @see app/Http/Controllers/ImageUploadController.php:52
* @route '/category-upload'
*/
storeCategory.url = (options?: RouteQueryOptions) => {
    return storeCategory.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ImageUploadController::storeCategory
* @see app/Http/Controllers/ImageUploadController.php:52
* @route '/category-upload'
*/
storeCategory.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeCategory.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ImageUploadController::storeProduct
* @see app/Http/Controllers/ImageUploadController.php:82
* @route '/product-upload'
*/
export const storeProduct = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeProduct.url(options),
    method: 'post',
})

storeProduct.definition = {
    methods: ["post"],
    url: '/product-upload',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ImageUploadController::storeProduct
* @see app/Http/Controllers/ImageUploadController.php:82
* @route '/product-upload'
*/
storeProduct.url = (options?: RouteQueryOptions) => {
    return storeProduct.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ImageUploadController::storeProduct
* @see app/Http/Controllers/ImageUploadController.php:82
* @route '/product-upload'
*/
storeProduct.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeProduct.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ImageUploadController::storeAttribute
* @see app/Http/Controllers/ImageUploadController.php:122
* @route '/attribute-upload'
*/
export const storeAttribute = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeAttribute.url(options),
    method: 'post',
})

storeAttribute.definition = {
    methods: ["post"],
    url: '/attribute-upload',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ImageUploadController::storeAttribute
* @see app/Http/Controllers/ImageUploadController.php:122
* @route '/attribute-upload'
*/
storeAttribute.url = (options?: RouteQueryOptions) => {
    return storeAttribute.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ImageUploadController::storeAttribute
* @see app/Http/Controllers/ImageUploadController.php:122
* @route '/attribute-upload'
*/
storeAttribute.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeAttribute.url(options),
    method: 'post',
})

const ImageUploadController = { storePhoto, storeCategory, storeProduct, storeAttribute }

export default ImageUploadController