import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\Sales\OrderController::calculatePromotions
* @see app/Http/Controllers/Admin/Sales/OrderController.php:211
* @route '/admin123/orders/calculate-promotions'
*/
export const calculatePromotions = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: calculatePromotions.url(options),
    method: 'post',
})

calculatePromotions.definition = {
    methods: ["post"],
    url: '/admin123/orders/calculate-promotions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Sales\OrderController::calculatePromotions
* @see app/Http/Controllers/Admin/Sales/OrderController.php:211
* @route '/admin123/orders/calculate-promotions'
*/
calculatePromotions.url = (options?: RouteQueryOptions) => {
    return calculatePromotions.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Sales\OrderController::calculatePromotions
* @see app/Http/Controllers/Admin/Sales/OrderController.php:211
* @route '/admin123/orders/calculate-promotions'
*/
calculatePromotions.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: calculatePromotions.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\Sales\OrderController::destroyMany
* @see app/Http/Controllers/Admin/Sales/OrderController.php:151
* @route '/admin123/orders/destroy-many'
*/
export const destroyMany = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyMany.url(options),
    method: 'delete',
})

destroyMany.definition = {
    methods: ["delete"],
    url: '/admin123/orders/destroy-many',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\Sales\OrderController::destroyMany
* @see app/Http/Controllers/Admin/Sales/OrderController.php:151
* @route '/admin123/orders/destroy-many'
*/
destroyMany.url = (options?: RouteQueryOptions) => {
    return destroyMany.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Sales\OrderController::destroyMany
* @see app/Http/Controllers/Admin/Sales/OrderController.php:151
* @route '/admin123/orders/destroy-many'
*/
destroyMany.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyMany.url(options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\Sales\OrderController::toggleStatus
* @see app/Http/Controllers/Admin/Sales/OrderController.php:0
* @route '/admin123/orders/{id}/toggle-status'
*/
export const toggleStatus = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleStatus.url(args, options),
    method: 'put',
})

toggleStatus.definition = {
    methods: ["put"],
    url: '/admin123/orders/{id}/toggle-status',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\Sales\OrderController::toggleStatus
* @see app/Http/Controllers/Admin/Sales/OrderController.php:0
* @route '/admin123/orders/{id}/toggle-status'
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
* @see \App\Http\Controllers\Admin\Sales\OrderController::toggleStatus
* @see app/Http/Controllers/Admin/Sales/OrderController.php:0
* @route '/admin123/orders/{id}/toggle-status'
*/
toggleStatus.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleStatus.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\Sales\OrderController::index
* @see app/Http/Controllers/Admin/Sales/OrderController.php:34
* @route '/admin123/orders'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin123/orders',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Sales\OrderController::index
* @see app/Http/Controllers/Admin/Sales/OrderController.php:34
* @route '/admin123/orders'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Sales\OrderController::index
* @see app/Http/Controllers/Admin/Sales/OrderController.php:34
* @route '/admin123/orders'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Sales\OrderController::index
* @see app/Http/Controllers/Admin/Sales/OrderController.php:34
* @route '/admin123/orders'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Sales\OrderController::create
* @see app/Http/Controllers/Admin/Sales/OrderController.php:50
* @route '/admin123/orders/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin123/orders/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Sales\OrderController::create
* @see app/Http/Controllers/Admin/Sales/OrderController.php:50
* @route '/admin123/orders/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Sales\OrderController::create
* @see app/Http/Controllers/Admin/Sales/OrderController.php:50
* @route '/admin123/orders/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Sales\OrderController::create
* @see app/Http/Controllers/Admin/Sales/OrderController.php:50
* @route '/admin123/orders/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Sales\OrderController::store
* @see app/Http/Controllers/Admin/Sales/OrderController.php:59
* @route '/admin123/orders'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin123/orders',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Sales\OrderController::store
* @see app/Http/Controllers/Admin/Sales/OrderController.php:59
* @route '/admin123/orders'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Sales\OrderController::store
* @see app/Http/Controllers/Admin/Sales/OrderController.php:59
* @route '/admin123/orders'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\Sales\OrderController::show
* @see app/Http/Controllers/Admin/Sales/OrderController.php:79
* @route '/admin123/orders/{order}'
*/
export const show = (args: { order: string | number } | [order: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin123/orders/{order}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Sales\OrderController::show
* @see app/Http/Controllers/Admin/Sales/OrderController.php:79
* @route '/admin123/orders/{order}'
*/
show.url = (args: { order: string | number } | [order: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args }
    }

    if (Array.isArray(args)) {
        args = {
            order: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        order: args.order,
    }

    return show.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Sales\OrderController::show
* @see app/Http/Controllers/Admin/Sales/OrderController.php:79
* @route '/admin123/orders/{order}'
*/
show.get = (args: { order: string | number } | [order: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Sales\OrderController::show
* @see app/Http/Controllers/Admin/Sales/OrderController.php:79
* @route '/admin123/orders/{order}'
*/
show.head = (args: { order: string | number } | [order: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Sales\OrderController::edit
* @see app/Http/Controllers/Admin/Sales/OrderController.php:95
* @route '/admin123/orders/{order}/edit'
*/
export const edit = (args: { order: string | number } | [order: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin123/orders/{order}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Sales\OrderController::edit
* @see app/Http/Controllers/Admin/Sales/OrderController.php:95
* @route '/admin123/orders/{order}/edit'
*/
edit.url = (args: { order: string | number } | [order: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args }
    }

    if (Array.isArray(args)) {
        args = {
            order: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        order: args.order,
    }

    return edit.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Sales\OrderController::edit
* @see app/Http/Controllers/Admin/Sales/OrderController.php:95
* @route '/admin123/orders/{order}/edit'
*/
edit.get = (args: { order: string | number } | [order: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Sales\OrderController::edit
* @see app/Http/Controllers/Admin/Sales/OrderController.php:95
* @route '/admin123/orders/{order}/edit'
*/
edit.head = (args: { order: string | number } | [order: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Sales\OrderController::update
* @see app/Http/Controllers/Admin/Sales/OrderController.php:110
* @route '/admin123/orders/{order}'
*/
export const update = (args: { order: string | number } | [order: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin123/orders/{order}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\Sales\OrderController::update
* @see app/Http/Controllers/Admin/Sales/OrderController.php:110
* @route '/admin123/orders/{order}'
*/
update.url = (args: { order: string | number } | [order: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args }
    }

    if (Array.isArray(args)) {
        args = {
            order: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        order: args.order,
    }

    return update.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Sales\OrderController::update
* @see app/Http/Controllers/Admin/Sales/OrderController.php:110
* @route '/admin123/orders/{order}'
*/
update.put = (args: { order: string | number } | [order: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\Sales\OrderController::update
* @see app/Http/Controllers/Admin/Sales/OrderController.php:110
* @route '/admin123/orders/{order}'
*/
update.patch = (args: { order: string | number } | [order: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\Sales\OrderController::destroy
* @see app/Http/Controllers/Admin/Sales/OrderController.php:139
* @route '/admin123/orders/{order}'
*/
export const destroy = (args: { order: string | number } | [order: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin123/orders/{order}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\Sales\OrderController::destroy
* @see app/Http/Controllers/Admin/Sales/OrderController.php:139
* @route '/admin123/orders/{order}'
*/
destroy.url = (args: { order: string | number } | [order: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args }
    }

    if (Array.isArray(args)) {
        args = {
            order: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        order: args.order,
    }

    return destroy.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Sales\OrderController::destroy
* @see app/Http/Controllers/Admin/Sales/OrderController.php:139
* @route '/admin123/orders/{order}'
*/
destroy.delete = (args: { order: string | number } | [order: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const orders = {
    calculatePromotions: Object.assign(calculatePromotions, calculatePromotions),
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

export default orders