import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\Catalog\ProductController::destroyMany
* @see app/Http/Controllers/Admin/Catalog/ProductController.php:139
* @route '/admin123/product/destroy-many'
*/
export const destroyMany = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyMany.url(options),
    method: 'delete',
})

destroyMany.definition = {
    methods: ["delete"],
    url: '/admin123/product/destroy-many',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\Catalog\ProductController::destroyMany
* @see app/Http/Controllers/Admin/Catalog/ProductController.php:139
* @route '/admin123/product/destroy-many'
*/
destroyMany.url = (options?: RouteQueryOptions) => {
    return destroyMany.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Catalog\ProductController::destroyMany
* @see app/Http/Controllers/Admin/Catalog/ProductController.php:139
* @route '/admin123/product/destroy-many'
*/
destroyMany.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyMany.url(options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\ProductController::toggleStatus
* @see app/Http/Controllers/Admin/Catalog/ProductController.php:0
* @route '/admin123/product/{id}/toggle-status'
*/
export const toggleStatus = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleStatus.url(args, options),
    method: 'put',
})

toggleStatus.definition = {
    methods: ["put"],
    url: '/admin123/product/{id}/toggle-status',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\Catalog\ProductController::toggleStatus
* @see app/Http/Controllers/Admin/Catalog/ProductController.php:0
* @route '/admin123/product/{id}/toggle-status'
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
* @see \App\Http\Controllers\Admin\Catalog\ProductController::toggleStatus
* @see app/Http/Controllers/Admin/Catalog/ProductController.php:0
* @route '/admin123/product/{id}/toggle-status'
*/
toggleStatus.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleStatus.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\ProductController::index
* @see app/Http/Controllers/Admin/Catalog/ProductController.php:45
* @route '/admin123/product'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin123/product',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Catalog\ProductController::index
* @see app/Http/Controllers/Admin/Catalog/ProductController.php:45
* @route '/admin123/product'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Catalog\ProductController::index
* @see app/Http/Controllers/Admin/Catalog/ProductController.php:45
* @route '/admin123/product'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\ProductController::index
* @see app/Http/Controllers/Admin/Catalog/ProductController.php:45
* @route '/admin123/product'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\ProductController::create
* @see app/Http/Controllers/Admin/Catalog/ProductController.php:56
* @route '/admin123/product/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin123/product/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Catalog\ProductController::create
* @see app/Http/Controllers/Admin/Catalog/ProductController.php:56
* @route '/admin123/product/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Catalog\ProductController::create
* @see app/Http/Controllers/Admin/Catalog/ProductController.php:56
* @route '/admin123/product/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\ProductController::create
* @see app/Http/Controllers/Admin/Catalog/ProductController.php:56
* @route '/admin123/product/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\ProductController::store
* @see app/Http/Controllers/Admin/Catalog/ProductController.php:72
* @route '/admin123/product'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin123/product',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Catalog\ProductController::store
* @see app/Http/Controllers/Admin/Catalog/ProductController.php:72
* @route '/admin123/product'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Catalog\ProductController::store
* @see app/Http/Controllers/Admin/Catalog/ProductController.php:72
* @route '/admin123/product'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\ProductController::show
* @see app/Http/Controllers/Admin/Catalog/ProductController.php:0
* @route '/admin123/product/{product}'
*/
export const show = (args: { product: string | number } | [product: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin123/product/{product}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Catalog\ProductController::show
* @see app/Http/Controllers/Admin/Catalog/ProductController.php:0
* @route '/admin123/product/{product}'
*/
show.url = (args: { product: string | number } | [product: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { product: args }
    }

    if (Array.isArray(args)) {
        args = {
            product: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        product: args.product,
    }

    return show.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Catalog\ProductController::show
* @see app/Http/Controllers/Admin/Catalog/ProductController.php:0
* @route '/admin123/product/{product}'
*/
show.get = (args: { product: string | number } | [product: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\ProductController::show
* @see app/Http/Controllers/Admin/Catalog/ProductController.php:0
* @route '/admin123/product/{product}'
*/
show.head = (args: { product: string | number } | [product: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\ProductController::edit
* @see app/Http/Controllers/Admin/Catalog/ProductController.php:90
* @route '/admin123/product/{product}/edit'
*/
export const edit = (args: { product: string | number } | [product: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin123/product/{product}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Catalog\ProductController::edit
* @see app/Http/Controllers/Admin/Catalog/ProductController.php:90
* @route '/admin123/product/{product}/edit'
*/
edit.url = (args: { product: string | number } | [product: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { product: args }
    }

    if (Array.isArray(args)) {
        args = {
            product: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        product: args.product,
    }

    return edit.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Catalog\ProductController::edit
* @see app/Http/Controllers/Admin/Catalog/ProductController.php:90
* @route '/admin123/product/{product}/edit'
*/
edit.get = (args: { product: string | number } | [product: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\ProductController::edit
* @see app/Http/Controllers/Admin/Catalog/ProductController.php:90
* @route '/admin123/product/{product}/edit'
*/
edit.head = (args: { product: string | number } | [product: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\ProductController::update
* @see app/Http/Controllers/Admin/Catalog/ProductController.php:107
* @route '/admin123/product/{product}'
*/
export const update = (args: { product: string | number } | [product: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin123/product/{product}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\Catalog\ProductController::update
* @see app/Http/Controllers/Admin/Catalog/ProductController.php:107
* @route '/admin123/product/{product}'
*/
update.url = (args: { product: string | number } | [product: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { product: args }
    }

    if (Array.isArray(args)) {
        args = {
            product: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        product: args.product,
    }

    return update.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Catalog\ProductController::update
* @see app/Http/Controllers/Admin/Catalog/ProductController.php:107
* @route '/admin123/product/{product}'
*/
update.put = (args: { product: string | number } | [product: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\ProductController::update
* @see app/Http/Controllers/Admin/Catalog/ProductController.php:107
* @route '/admin123/product/{product}'
*/
update.patch = (args: { product: string | number } | [product: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\ProductController::destroy
* @see app/Http/Controllers/Admin/Catalog/ProductController.php:126
* @route '/admin123/product/{product}'
*/
export const destroy = (args: { product: string | number } | [product: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin123/product/{product}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\Catalog\ProductController::destroy
* @see app/Http/Controllers/Admin/Catalog/ProductController.php:126
* @route '/admin123/product/{product}'
*/
destroy.url = (args: { product: string | number } | [product: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { product: args }
    }

    if (Array.isArray(args)) {
        args = {
            product: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        product: args.product,
    }

    return destroy.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Catalog\ProductController::destroy
* @see app/Http/Controllers/Admin/Catalog/ProductController.php:126
* @route '/admin123/product/{product}'
*/
destroy.delete = (args: { product: string | number } | [product: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const ProductController = { destroyMany, toggleStatus, index, create, store, show, edit, update, destroy }

export default ProductController