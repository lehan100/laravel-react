import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\Sales\ShippingMethodController::destroyMany
* @see app/Http/Controllers/Admin/Sales/ShippingMethodController.php:129
* @route '/admin123/shipping-methods/destroy-many'
*/
export const destroyMany = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyMany.url(options),
    method: 'delete',
})

destroyMany.definition = {
    methods: ["delete"],
    url: '/admin123/shipping-methods/destroy-many',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\Sales\ShippingMethodController::destroyMany
* @see app/Http/Controllers/Admin/Sales/ShippingMethodController.php:129
* @route '/admin123/shipping-methods/destroy-many'
*/
destroyMany.url = (options?: RouteQueryOptions) => {
    return destroyMany.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Sales\ShippingMethodController::destroyMany
* @see app/Http/Controllers/Admin/Sales/ShippingMethodController.php:129
* @route '/admin123/shipping-methods/destroy-many'
*/
destroyMany.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyMany.url(options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\Sales\ShippingMethodController::toggleStatus
* @see app/Http/Controllers/Admin/Sales/ShippingMethodController.php:141
* @route '/admin123/shipping-methods/{id}/toggle-status'
*/
export const toggleStatus = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleStatus.url(args, options),
    method: 'put',
})

toggleStatus.definition = {
    methods: ["put"],
    url: '/admin123/shipping-methods/{id}/toggle-status',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\Sales\ShippingMethodController::toggleStatus
* @see app/Http/Controllers/Admin/Sales/ShippingMethodController.php:141
* @route '/admin123/shipping-methods/{id}/toggle-status'
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
* @see \App\Http\Controllers\Admin\Sales\ShippingMethodController::toggleStatus
* @see app/Http/Controllers/Admin/Sales/ShippingMethodController.php:141
* @route '/admin123/shipping-methods/{id}/toggle-status'
*/
toggleStatus.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleStatus.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\Sales\ShippingMethodController::index
* @see app/Http/Controllers/Admin/Sales/ShippingMethodController.php:31
* @route '/admin123/shipping-methods'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin123/shipping-methods',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Sales\ShippingMethodController::index
* @see app/Http/Controllers/Admin/Sales/ShippingMethodController.php:31
* @route '/admin123/shipping-methods'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Sales\ShippingMethodController::index
* @see app/Http/Controllers/Admin/Sales/ShippingMethodController.php:31
* @route '/admin123/shipping-methods'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Sales\ShippingMethodController::index
* @see app/Http/Controllers/Admin/Sales/ShippingMethodController.php:31
* @route '/admin123/shipping-methods'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Sales\ShippingMethodController::create
* @see app/Http/Controllers/Admin/Sales/ShippingMethodController.php:47
* @route '/admin123/shipping-methods/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin123/shipping-methods/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Sales\ShippingMethodController::create
* @see app/Http/Controllers/Admin/Sales/ShippingMethodController.php:47
* @route '/admin123/shipping-methods/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Sales\ShippingMethodController::create
* @see app/Http/Controllers/Admin/Sales/ShippingMethodController.php:47
* @route '/admin123/shipping-methods/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Sales\ShippingMethodController::create
* @see app/Http/Controllers/Admin/Sales/ShippingMethodController.php:47
* @route '/admin123/shipping-methods/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Sales\ShippingMethodController::store
* @see app/Http/Controllers/Admin/Sales/ShippingMethodController.php:54
* @route '/admin123/shipping-methods'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin123/shipping-methods',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Sales\ShippingMethodController::store
* @see app/Http/Controllers/Admin/Sales/ShippingMethodController.php:54
* @route '/admin123/shipping-methods'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Sales\ShippingMethodController::store
* @see app/Http/Controllers/Admin/Sales/ShippingMethodController.php:54
* @route '/admin123/shipping-methods'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\Sales\ShippingMethodController::show
* @see app/Http/Controllers/Admin/Sales/ShippingMethodController.php:73
* @route '/admin123/shipping-methods/{shipping_method}'
*/
export const show = (args: { shipping_method: string | number } | [shipping_method: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin123/shipping-methods/{shipping_method}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Sales\ShippingMethodController::show
* @see app/Http/Controllers/Admin/Sales/ShippingMethodController.php:73
* @route '/admin123/shipping-methods/{shipping_method}'
*/
show.url = (args: { shipping_method: string | number } | [shipping_method: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { shipping_method: args }
    }

    if (Array.isArray(args)) {
        args = {
            shipping_method: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        shipping_method: args.shipping_method,
    }

    return show.definition.url
            .replace('{shipping_method}', parsedArgs.shipping_method.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Sales\ShippingMethodController::show
* @see app/Http/Controllers/Admin/Sales/ShippingMethodController.php:73
* @route '/admin123/shipping-methods/{shipping_method}'
*/
show.get = (args: { shipping_method: string | number } | [shipping_method: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Sales\ShippingMethodController::show
* @see app/Http/Controllers/Admin/Sales/ShippingMethodController.php:73
* @route '/admin123/shipping-methods/{shipping_method}'
*/
show.head = (args: { shipping_method: string | number } | [shipping_method: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Sales\ShippingMethodController::edit
* @see app/Http/Controllers/Admin/Sales/ShippingMethodController.php:78
* @route '/admin123/shipping-methods/{shipping_method}/edit'
*/
export const edit = (args: { shipping_method: string | number } | [shipping_method: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin123/shipping-methods/{shipping_method}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Sales\ShippingMethodController::edit
* @see app/Http/Controllers/Admin/Sales/ShippingMethodController.php:78
* @route '/admin123/shipping-methods/{shipping_method}/edit'
*/
edit.url = (args: { shipping_method: string | number } | [shipping_method: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { shipping_method: args }
    }

    if (Array.isArray(args)) {
        args = {
            shipping_method: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        shipping_method: args.shipping_method,
    }

    return edit.definition.url
            .replace('{shipping_method}', parsedArgs.shipping_method.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Sales\ShippingMethodController::edit
* @see app/Http/Controllers/Admin/Sales/ShippingMethodController.php:78
* @route '/admin123/shipping-methods/{shipping_method}/edit'
*/
edit.get = (args: { shipping_method: string | number } | [shipping_method: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Sales\ShippingMethodController::edit
* @see app/Http/Controllers/Admin/Sales/ShippingMethodController.php:78
* @route '/admin123/shipping-methods/{shipping_method}/edit'
*/
edit.head = (args: { shipping_method: string | number } | [shipping_method: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Sales\ShippingMethodController::update
* @see app/Http/Controllers/Admin/Sales/ShippingMethodController.php:91
* @route '/admin123/shipping-methods/{shipping_method}'
*/
export const update = (args: { shipping_method: string | number } | [shipping_method: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin123/shipping-methods/{shipping_method}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\Sales\ShippingMethodController::update
* @see app/Http/Controllers/Admin/Sales/ShippingMethodController.php:91
* @route '/admin123/shipping-methods/{shipping_method}'
*/
update.url = (args: { shipping_method: string | number } | [shipping_method: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { shipping_method: args }
    }

    if (Array.isArray(args)) {
        args = {
            shipping_method: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        shipping_method: args.shipping_method,
    }

    return update.definition.url
            .replace('{shipping_method}', parsedArgs.shipping_method.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Sales\ShippingMethodController::update
* @see app/Http/Controllers/Admin/Sales/ShippingMethodController.php:91
* @route '/admin123/shipping-methods/{shipping_method}'
*/
update.put = (args: { shipping_method: string | number } | [shipping_method: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\Sales\ShippingMethodController::update
* @see app/Http/Controllers/Admin/Sales/ShippingMethodController.php:91
* @route '/admin123/shipping-methods/{shipping_method}'
*/
update.patch = (args: { shipping_method: string | number } | [shipping_method: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\Sales\ShippingMethodController::destroy
* @see app/Http/Controllers/Admin/Sales/ShippingMethodController.php:117
* @route '/admin123/shipping-methods/{shipping_method}'
*/
export const destroy = (args: { shipping_method: string | number } | [shipping_method: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin123/shipping-methods/{shipping_method}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\Sales\ShippingMethodController::destroy
* @see app/Http/Controllers/Admin/Sales/ShippingMethodController.php:117
* @route '/admin123/shipping-methods/{shipping_method}'
*/
destroy.url = (args: { shipping_method: string | number } | [shipping_method: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { shipping_method: args }
    }

    if (Array.isArray(args)) {
        args = {
            shipping_method: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        shipping_method: args.shipping_method,
    }

    return destroy.definition.url
            .replace('{shipping_method}', parsedArgs.shipping_method.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Sales\ShippingMethodController::destroy
* @see app/Http/Controllers/Admin/Sales/ShippingMethodController.php:117
* @route '/admin123/shipping-methods/{shipping_method}'
*/
destroy.delete = (args: { shipping_method: string | number } | [shipping_method: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const shippingMethods = {
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

export default shippingMethods