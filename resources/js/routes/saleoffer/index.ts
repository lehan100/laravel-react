import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\Promotion\SaleOfferController::productsPicker
* @see app/Http/Controllers/Admin/Promotion/SaleOfferController.php:113
* @route '/admin123/saleoffer/products-picker'
*/
export const productsPicker = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: productsPicker.url(options),
    method: 'get',
})

productsPicker.definition = {
    methods: ["get","head"],
    url: '/admin123/saleoffer/products-picker',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Promotion\SaleOfferController::productsPicker
* @see app/Http/Controllers/Admin/Promotion/SaleOfferController.php:113
* @route '/admin123/saleoffer/products-picker'
*/
productsPicker.url = (options?: RouteQueryOptions) => {
    return productsPicker.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Promotion\SaleOfferController::productsPicker
* @see app/Http/Controllers/Admin/Promotion/SaleOfferController.php:113
* @route '/admin123/saleoffer/products-picker'
*/
productsPicker.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: productsPicker.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\SaleOfferController::productsPicker
* @see app/Http/Controllers/Admin/Promotion/SaleOfferController.php:113
* @route '/admin123/saleoffer/products-picker'
*/
productsPicker.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: productsPicker.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\SaleOfferController::destroyMany
* @see app/Http/Controllers/Admin/Promotion/SaleOfferController.php:160
* @route '/admin123/saleoffer/destroy-many'
*/
export const destroyMany = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyMany.url(options),
    method: 'delete',
})

destroyMany.definition = {
    methods: ["delete"],
    url: '/admin123/saleoffer/destroy-many',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\Promotion\SaleOfferController::destroyMany
* @see app/Http/Controllers/Admin/Promotion/SaleOfferController.php:160
* @route '/admin123/saleoffer/destroy-many'
*/
destroyMany.url = (options?: RouteQueryOptions) => {
    return destroyMany.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Promotion\SaleOfferController::destroyMany
* @see app/Http/Controllers/Admin/Promotion/SaleOfferController.php:160
* @route '/admin123/saleoffer/destroy-many'
*/
destroyMany.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyMany.url(options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\SaleOfferController::toggleStatus
* @see app/Http/Controllers/Admin/Promotion/SaleOfferController.php:0
* @route '/admin123/saleoffer/{id}/toggle-status'
*/
export const toggleStatus = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleStatus.url(args, options),
    method: 'put',
})

toggleStatus.definition = {
    methods: ["put"],
    url: '/admin123/saleoffer/{id}/toggle-status',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\Promotion\SaleOfferController::toggleStatus
* @see app/Http/Controllers/Admin/Promotion/SaleOfferController.php:0
* @route '/admin123/saleoffer/{id}/toggle-status'
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
* @see \App\Http\Controllers\Admin\Promotion\SaleOfferController::toggleStatus
* @see app/Http/Controllers/Admin/Promotion/SaleOfferController.php:0
* @route '/admin123/saleoffer/{id}/toggle-status'
*/
toggleStatus.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleStatus.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\SaleOfferController::index
* @see app/Http/Controllers/Admin/Promotion/SaleOfferController.php:39
* @route '/admin123/saleoffer'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin123/saleoffer',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Promotion\SaleOfferController::index
* @see app/Http/Controllers/Admin/Promotion/SaleOfferController.php:39
* @route '/admin123/saleoffer'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Promotion\SaleOfferController::index
* @see app/Http/Controllers/Admin/Promotion/SaleOfferController.php:39
* @route '/admin123/saleoffer'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\SaleOfferController::index
* @see app/Http/Controllers/Admin/Promotion/SaleOfferController.php:39
* @route '/admin123/saleoffer'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\SaleOfferController::create
* @see app/Http/Controllers/Admin/Promotion/SaleOfferController.php:49
* @route '/admin123/saleoffer/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin123/saleoffer/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Promotion\SaleOfferController::create
* @see app/Http/Controllers/Admin/Promotion/SaleOfferController.php:49
* @route '/admin123/saleoffer/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Promotion\SaleOfferController::create
* @see app/Http/Controllers/Admin/Promotion/SaleOfferController.php:49
* @route '/admin123/saleoffer/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\SaleOfferController::create
* @see app/Http/Controllers/Admin/Promotion/SaleOfferController.php:49
* @route '/admin123/saleoffer/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\SaleOfferController::store
* @see app/Http/Controllers/Admin/Promotion/SaleOfferController.php:63
* @route '/admin123/saleoffer'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin123/saleoffer',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Promotion\SaleOfferController::store
* @see app/Http/Controllers/Admin/Promotion/SaleOfferController.php:63
* @route '/admin123/saleoffer'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Promotion\SaleOfferController::store
* @see app/Http/Controllers/Admin/Promotion/SaleOfferController.php:63
* @route '/admin123/saleoffer'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\SaleOfferController::show
* @see app/Http/Controllers/Admin/Promotion/SaleOfferController.php:82
* @route '/admin123/saleoffer/{saleoffer}'
*/
export const show = (args: { saleoffer: string | number } | [saleoffer: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin123/saleoffer/{saleoffer}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Promotion\SaleOfferController::show
* @see app/Http/Controllers/Admin/Promotion/SaleOfferController.php:82
* @route '/admin123/saleoffer/{saleoffer}'
*/
show.url = (args: { saleoffer: string | number } | [saleoffer: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { saleoffer: args }
    }

    if (Array.isArray(args)) {
        args = {
            saleoffer: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        saleoffer: args.saleoffer,
    }

    return show.definition.url
            .replace('{saleoffer}', parsedArgs.saleoffer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Promotion\SaleOfferController::show
* @see app/Http/Controllers/Admin/Promotion/SaleOfferController.php:82
* @route '/admin123/saleoffer/{saleoffer}'
*/
show.get = (args: { saleoffer: string | number } | [saleoffer: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\SaleOfferController::show
* @see app/Http/Controllers/Admin/Promotion/SaleOfferController.php:82
* @route '/admin123/saleoffer/{saleoffer}'
*/
show.head = (args: { saleoffer: string | number } | [saleoffer: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\SaleOfferController::edit
* @see app/Http/Controllers/Admin/Promotion/SaleOfferController.php:96
* @route '/admin123/saleoffer/{saleoffer}/edit'
*/
export const edit = (args: { saleoffer: string | number } | [saleoffer: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin123/saleoffer/{saleoffer}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Promotion\SaleOfferController::edit
* @see app/Http/Controllers/Admin/Promotion/SaleOfferController.php:96
* @route '/admin123/saleoffer/{saleoffer}/edit'
*/
edit.url = (args: { saleoffer: string | number } | [saleoffer: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { saleoffer: args }
    }

    if (Array.isArray(args)) {
        args = {
            saleoffer: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        saleoffer: args.saleoffer,
    }

    return edit.definition.url
            .replace('{saleoffer}', parsedArgs.saleoffer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Promotion\SaleOfferController::edit
* @see app/Http/Controllers/Admin/Promotion/SaleOfferController.php:96
* @route '/admin123/saleoffer/{saleoffer}/edit'
*/
edit.get = (args: { saleoffer: string | number } | [saleoffer: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\SaleOfferController::edit
* @see app/Http/Controllers/Admin/Promotion/SaleOfferController.php:96
* @route '/admin123/saleoffer/{saleoffer}/edit'
*/
edit.head = (args: { saleoffer: string | number } | [saleoffer: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\SaleOfferController::update
* @see app/Http/Controllers/Admin/Promotion/SaleOfferController.php:128
* @route '/admin123/saleoffer/{saleoffer}'
*/
export const update = (args: { saleoffer: string | number } | [saleoffer: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin123/saleoffer/{saleoffer}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\Promotion\SaleOfferController::update
* @see app/Http/Controllers/Admin/Promotion/SaleOfferController.php:128
* @route '/admin123/saleoffer/{saleoffer}'
*/
update.url = (args: { saleoffer: string | number } | [saleoffer: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { saleoffer: args }
    }

    if (Array.isArray(args)) {
        args = {
            saleoffer: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        saleoffer: args.saleoffer,
    }

    return update.definition.url
            .replace('{saleoffer}', parsedArgs.saleoffer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Promotion\SaleOfferController::update
* @see app/Http/Controllers/Admin/Promotion/SaleOfferController.php:128
* @route '/admin123/saleoffer/{saleoffer}'
*/
update.put = (args: { saleoffer: string | number } | [saleoffer: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\SaleOfferController::update
* @see app/Http/Controllers/Admin/Promotion/SaleOfferController.php:128
* @route '/admin123/saleoffer/{saleoffer}'
*/
update.patch = (args: { saleoffer: string | number } | [saleoffer: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\SaleOfferController::destroy
* @see app/Http/Controllers/Admin/Promotion/SaleOfferController.php:148
* @route '/admin123/saleoffer/{saleoffer}'
*/
export const destroy = (args: { saleoffer: string | number } | [saleoffer: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin123/saleoffer/{saleoffer}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\Promotion\SaleOfferController::destroy
* @see app/Http/Controllers/Admin/Promotion/SaleOfferController.php:148
* @route '/admin123/saleoffer/{saleoffer}'
*/
destroy.url = (args: { saleoffer: string | number } | [saleoffer: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { saleoffer: args }
    }

    if (Array.isArray(args)) {
        args = {
            saleoffer: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        saleoffer: args.saleoffer,
    }

    return destroy.definition.url
            .replace('{saleoffer}', parsedArgs.saleoffer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Promotion\SaleOfferController::destroy
* @see app/Http/Controllers/Admin/Promotion/SaleOfferController.php:148
* @route '/admin123/saleoffer/{saleoffer}'
*/
destroy.delete = (args: { saleoffer: string | number } | [saleoffer: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const saleoffer = {
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

export default saleoffer