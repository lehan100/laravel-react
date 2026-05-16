import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
import ai from './ai'
/**
* @see \App\Http\Controllers\ImageUploadController::upload
* @see app/Http/Controllers/ImageUploadController.php:52
* @route '/category-upload'
*/
export const upload = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: upload.url(options),
    method: 'post',
})

upload.definition = {
    methods: ["post"],
    url: '/category-upload',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ImageUploadController::upload
* @see app/Http/Controllers/ImageUploadController.php:52
* @route '/category-upload'
*/
upload.url = (options?: RouteQueryOptions) => {
    return upload.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ImageUploadController::upload
* @see app/Http/Controllers/ImageUploadController.php:52
* @route '/category-upload'
*/
upload.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: upload.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\CategoryController::reorder
* @see app/Http/Controllers/Admin/Catalog/CategoryController.php:185
* @route '/admin123/category/reorder'
*/
export const reorder = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reorder.url(options),
    method: 'post',
})

reorder.definition = {
    methods: ["post"],
    url: '/admin123/category/reorder',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Catalog\CategoryController::reorder
* @see app/Http/Controllers/Admin/Catalog/CategoryController.php:185
* @route '/admin123/category/reorder'
*/
reorder.url = (options?: RouteQueryOptions) => {
    return reorder.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Catalog\CategoryController::reorder
* @see app/Http/Controllers/Admin/Catalog/CategoryController.php:185
* @route '/admin123/category/reorder'
*/
reorder.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reorder.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\CategoryController::productsPicker
* @see app/Http/Controllers/Admin/Catalog/CategoryController.php:134
* @route '/admin123/category/products-picker'
*/
export const productsPicker = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: productsPicker.url(options),
    method: 'get',
})

productsPicker.definition = {
    methods: ["get","head"],
    url: '/admin123/category/products-picker',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Catalog\CategoryController::productsPicker
* @see app/Http/Controllers/Admin/Catalog/CategoryController.php:134
* @route '/admin123/category/products-picker'
*/
productsPicker.url = (options?: RouteQueryOptions) => {
    return productsPicker.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Catalog\CategoryController::productsPicker
* @see app/Http/Controllers/Admin/Catalog/CategoryController.php:134
* @route '/admin123/category/products-picker'
*/
productsPicker.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: productsPicker.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\CategoryController::productsPicker
* @see app/Http/Controllers/Admin/Catalog/CategoryController.php:134
* @route '/admin123/category/products-picker'
*/
productsPicker.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: productsPicker.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\CategoryController::destroyMany
* @see app/Http/Controllers/Admin/Catalog/CategoryController.php:0
* @route '/admin123/category/destroy-many'
*/
export const destroyMany = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyMany.url(options),
    method: 'delete',
})

destroyMany.definition = {
    methods: ["delete"],
    url: '/admin123/category/destroy-many',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\Catalog\CategoryController::destroyMany
* @see app/Http/Controllers/Admin/Catalog/CategoryController.php:0
* @route '/admin123/category/destroy-many'
*/
destroyMany.url = (options?: RouteQueryOptions) => {
    return destroyMany.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Catalog\CategoryController::destroyMany
* @see app/Http/Controllers/Admin/Catalog/CategoryController.php:0
* @route '/admin123/category/destroy-many'
*/
destroyMany.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyMany.url(options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\CategoryController::toggleStatus
* @see app/Http/Controllers/Admin/Catalog/CategoryController.php:0
* @route '/admin123/category/{id}/toggle-status'
*/
export const toggleStatus = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleStatus.url(args, options),
    method: 'put',
})

toggleStatus.definition = {
    methods: ["put"],
    url: '/admin123/category/{id}/toggle-status',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\Catalog\CategoryController::toggleStatus
* @see app/Http/Controllers/Admin/Catalog/CategoryController.php:0
* @route '/admin123/category/{id}/toggle-status'
*/
toggleStatus.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    if (Array.isArray(args)) {
        args = {
            id: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        id: args.id,
    }

    return toggleStatus.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Catalog\CategoryController::toggleStatus
* @see app/Http/Controllers/Admin/Catalog/CategoryController.php:0
* @route '/admin123/category/{id}/toggle-status'
*/
toggleStatus.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleStatus.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\CategoryController::index
* @see app/Http/Controllers/Admin/Catalog/CategoryController.php:52
* @route '/admin123/category'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin123/category',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Catalog\CategoryController::index
* @see app/Http/Controllers/Admin/Catalog/CategoryController.php:52
* @route '/admin123/category'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Catalog\CategoryController::index
* @see app/Http/Controllers/Admin/Catalog/CategoryController.php:52
* @route '/admin123/category'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\CategoryController::index
* @see app/Http/Controllers/Admin/Catalog/CategoryController.php:52
* @route '/admin123/category'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\CategoryController::create
* @see app/Http/Controllers/Admin/Catalog/CategoryController.php:62
* @route '/admin123/category/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin123/category/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Catalog\CategoryController::create
* @see app/Http/Controllers/Admin/Catalog/CategoryController.php:62
* @route '/admin123/category/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Catalog\CategoryController::create
* @see app/Http/Controllers/Admin/Catalog/CategoryController.php:62
* @route '/admin123/category/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\CategoryController::create
* @see app/Http/Controllers/Admin/Catalog/CategoryController.php:62
* @route '/admin123/category/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\CategoryController::store
* @see app/Http/Controllers/Admin/Catalog/CategoryController.php:80
* @route '/admin123/category'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin123/category',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Catalog\CategoryController::store
* @see app/Http/Controllers/Admin/Catalog/CategoryController.php:80
* @route '/admin123/category'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Catalog\CategoryController::store
* @see app/Http/Controllers/Admin/Catalog/CategoryController.php:80
* @route '/admin123/category'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\CategoryController::show
* @see app/Http/Controllers/Admin/Catalog/CategoryController.php:100
* @route '/admin123/category/{category}'
*/
export const show = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin123/category/{category}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Catalog\CategoryController::show
* @see app/Http/Controllers/Admin/Catalog/CategoryController.php:100
* @route '/admin123/category/{category}'
*/
show.url = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { category: args }
    }

    if (Array.isArray(args)) {
        args = {
            category: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        category: args.category,
    }

    return show.definition.url
            .replace('{category}', parsedArgs.category.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Catalog\CategoryController::show
* @see app/Http/Controllers/Admin/Catalog/CategoryController.php:100
* @route '/admin123/category/{category}'
*/
show.get = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\CategoryController::show
* @see app/Http/Controllers/Admin/Catalog/CategoryController.php:100
* @route '/admin123/category/{category}'
*/
show.head = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\CategoryController::edit
* @see app/Http/Controllers/Admin/Catalog/CategoryController.php:108
* @route '/admin123/category/{category}/edit'
*/
export const edit = (args: { category: number | { id: number } } | [category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin123/category/{category}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Catalog\CategoryController::edit
* @see app/Http/Controllers/Admin/Catalog/CategoryController.php:108
* @route '/admin123/category/{category}/edit'
*/
edit.url = (args: { category: number | { id: number } } | [category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { category: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { category: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            category: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        category: typeof args.category === 'object'
        ? args.category.id
        : args.category,
    }

    return edit.definition.url
            .replace('{category}', parsedArgs.category.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Catalog\CategoryController::edit
* @see app/Http/Controllers/Admin/Catalog/CategoryController.php:108
* @route '/admin123/category/{category}/edit'
*/
edit.get = (args: { category: number | { id: number } } | [category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\CategoryController::edit
* @see app/Http/Controllers/Admin/Catalog/CategoryController.php:108
* @route '/admin123/category/{category}/edit'
*/
edit.head = (args: { category: number | { id: number } } | [category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\CategoryController::update
* @see app/Http/Controllers/Admin/Catalog/CategoryController.php:150
* @route '/admin123/category/{category}'
*/
export const update = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin123/category/{category}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\Catalog\CategoryController::update
* @see app/Http/Controllers/Admin/Catalog/CategoryController.php:150
* @route '/admin123/category/{category}'
*/
update.url = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { category: args }
    }

    if (Array.isArray(args)) {
        args = {
            category: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        category: args.category,
    }

    return update.definition.url
            .replace('{category}', parsedArgs.category.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Catalog\CategoryController::update
* @see app/Http/Controllers/Admin/Catalog/CategoryController.php:150
* @route '/admin123/category/{category}'
*/
update.put = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\CategoryController::update
* @see app/Http/Controllers/Admin/Catalog/CategoryController.php:150
* @route '/admin123/category/{category}'
*/
update.patch = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\CategoryController::destroy
* @see app/Http/Controllers/Admin/Catalog/CategoryController.php:172
* @route '/admin123/category/{category}'
*/
export const destroy = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin123/category/{category}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\Catalog\CategoryController::destroy
* @see app/Http/Controllers/Admin/Catalog/CategoryController.php:172
* @route '/admin123/category/{category}'
*/
destroy.url = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { category: args }
    }

    if (Array.isArray(args)) {
        args = {
            category: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        category: args.category,
    }

    return destroy.definition.url
            .replace('{category}', parsedArgs.category.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Catalog\CategoryController::destroy
* @see app/Http/Controllers/Admin/Catalog/CategoryController.php:172
* @route '/admin123/category/{category}'
*/
destroy.delete = (args: { category: string | number } | [category: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const category = {
    upload: Object.assign(upload, upload),
    reorder: Object.assign(reorder, reorder),
    ai: Object.assign(ai, ai),
    productsPicker: Object.assign(productsPicker, productsPicker),
    destroyMany: Object.assign(destroyMany, destroyMany),
    toggleStatus: Object.assign(toggleStatus, toggleStatus),
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default category