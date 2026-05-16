import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\Sales\PaymentMethodController::destroyMany
* @see app/Http/Controllers/Admin/Sales/PaymentMethodController.php:129
* @route '/admin123/payment-methods/destroy-many'
*/
export const destroyMany = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyMany.url(options),
    method: 'delete',
})

destroyMany.definition = {
    methods: ["delete"],
    url: '/admin123/payment-methods/destroy-many',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\Sales\PaymentMethodController::destroyMany
* @see app/Http/Controllers/Admin/Sales/PaymentMethodController.php:129
* @route '/admin123/payment-methods/destroy-many'
*/
destroyMany.url = (options?: RouteQueryOptions) => {
    return destroyMany.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Sales\PaymentMethodController::destroyMany
* @see app/Http/Controllers/Admin/Sales/PaymentMethodController.php:129
* @route '/admin123/payment-methods/destroy-many'
*/
destroyMany.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyMany.url(options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\Sales\PaymentMethodController::toggleStatus
* @see app/Http/Controllers/Admin/Sales/PaymentMethodController.php:141
* @route '/admin123/payment-methods/{id}/toggle-status'
*/
export const toggleStatus = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleStatus.url(args, options),
    method: 'put',
})

toggleStatus.definition = {
    methods: ["put"],
    url: '/admin123/payment-methods/{id}/toggle-status',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\Sales\PaymentMethodController::toggleStatus
* @see app/Http/Controllers/Admin/Sales/PaymentMethodController.php:141
* @route '/admin123/payment-methods/{id}/toggle-status'
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
* @see \App\Http\Controllers\Admin\Sales\PaymentMethodController::toggleStatus
* @see app/Http/Controllers/Admin/Sales/PaymentMethodController.php:141
* @route '/admin123/payment-methods/{id}/toggle-status'
*/
toggleStatus.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleStatus.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\Sales\PaymentMethodController::index
* @see app/Http/Controllers/Admin/Sales/PaymentMethodController.php:31
* @route '/admin123/payment-methods'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin123/payment-methods',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Sales\PaymentMethodController::index
* @see app/Http/Controllers/Admin/Sales/PaymentMethodController.php:31
* @route '/admin123/payment-methods'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Sales\PaymentMethodController::index
* @see app/Http/Controllers/Admin/Sales/PaymentMethodController.php:31
* @route '/admin123/payment-methods'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Sales\PaymentMethodController::index
* @see app/Http/Controllers/Admin/Sales/PaymentMethodController.php:31
* @route '/admin123/payment-methods'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Sales\PaymentMethodController::create
* @see app/Http/Controllers/Admin/Sales/PaymentMethodController.php:47
* @route '/admin123/payment-methods/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin123/payment-methods/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Sales\PaymentMethodController::create
* @see app/Http/Controllers/Admin/Sales/PaymentMethodController.php:47
* @route '/admin123/payment-methods/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Sales\PaymentMethodController::create
* @see app/Http/Controllers/Admin/Sales/PaymentMethodController.php:47
* @route '/admin123/payment-methods/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Sales\PaymentMethodController::create
* @see app/Http/Controllers/Admin/Sales/PaymentMethodController.php:47
* @route '/admin123/payment-methods/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Sales\PaymentMethodController::store
* @see app/Http/Controllers/Admin/Sales/PaymentMethodController.php:54
* @route '/admin123/payment-methods'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin123/payment-methods',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Sales\PaymentMethodController::store
* @see app/Http/Controllers/Admin/Sales/PaymentMethodController.php:54
* @route '/admin123/payment-methods'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Sales\PaymentMethodController::store
* @see app/Http/Controllers/Admin/Sales/PaymentMethodController.php:54
* @route '/admin123/payment-methods'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\Sales\PaymentMethodController::show
* @see app/Http/Controllers/Admin/Sales/PaymentMethodController.php:73
* @route '/admin123/payment-methods/{payment_method}'
*/
export const show = (args: { payment_method: string | number } | [payment_method: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin123/payment-methods/{payment_method}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Sales\PaymentMethodController::show
* @see app/Http/Controllers/Admin/Sales/PaymentMethodController.php:73
* @route '/admin123/payment-methods/{payment_method}'
*/
show.url = (args: { payment_method: string | number } | [payment_method: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payment_method: args }
    }

    if (Array.isArray(args)) {
        args = {
            payment_method: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        payment_method: args.payment_method,
    }

    return show.definition.url
            .replace('{payment_method}', parsedArgs.payment_method.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Sales\PaymentMethodController::show
* @see app/Http/Controllers/Admin/Sales/PaymentMethodController.php:73
* @route '/admin123/payment-methods/{payment_method}'
*/
show.get = (args: { payment_method: string | number } | [payment_method: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Sales\PaymentMethodController::show
* @see app/Http/Controllers/Admin/Sales/PaymentMethodController.php:73
* @route '/admin123/payment-methods/{payment_method}'
*/
show.head = (args: { payment_method: string | number } | [payment_method: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Sales\PaymentMethodController::edit
* @see app/Http/Controllers/Admin/Sales/PaymentMethodController.php:78
* @route '/admin123/payment-methods/{payment_method}/edit'
*/
export const edit = (args: { payment_method: string | number } | [payment_method: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin123/payment-methods/{payment_method}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Sales\PaymentMethodController::edit
* @see app/Http/Controllers/Admin/Sales/PaymentMethodController.php:78
* @route '/admin123/payment-methods/{payment_method}/edit'
*/
edit.url = (args: { payment_method: string | number } | [payment_method: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payment_method: args }
    }

    if (Array.isArray(args)) {
        args = {
            payment_method: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        payment_method: args.payment_method,
    }

    return edit.definition.url
            .replace('{payment_method}', parsedArgs.payment_method.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Sales\PaymentMethodController::edit
* @see app/Http/Controllers/Admin/Sales/PaymentMethodController.php:78
* @route '/admin123/payment-methods/{payment_method}/edit'
*/
edit.get = (args: { payment_method: string | number } | [payment_method: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Sales\PaymentMethodController::edit
* @see app/Http/Controllers/Admin/Sales/PaymentMethodController.php:78
* @route '/admin123/payment-methods/{payment_method}/edit'
*/
edit.head = (args: { payment_method: string | number } | [payment_method: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Sales\PaymentMethodController::update
* @see app/Http/Controllers/Admin/Sales/PaymentMethodController.php:91
* @route '/admin123/payment-methods/{payment_method}'
*/
export const update = (args: { payment_method: string | number } | [payment_method: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin123/payment-methods/{payment_method}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\Sales\PaymentMethodController::update
* @see app/Http/Controllers/Admin/Sales/PaymentMethodController.php:91
* @route '/admin123/payment-methods/{payment_method}'
*/
update.url = (args: { payment_method: string | number } | [payment_method: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payment_method: args }
    }

    if (Array.isArray(args)) {
        args = {
            payment_method: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        payment_method: args.payment_method,
    }

    return update.definition.url
            .replace('{payment_method}', parsedArgs.payment_method.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Sales\PaymentMethodController::update
* @see app/Http/Controllers/Admin/Sales/PaymentMethodController.php:91
* @route '/admin123/payment-methods/{payment_method}'
*/
update.put = (args: { payment_method: string | number } | [payment_method: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\Sales\PaymentMethodController::update
* @see app/Http/Controllers/Admin/Sales/PaymentMethodController.php:91
* @route '/admin123/payment-methods/{payment_method}'
*/
update.patch = (args: { payment_method: string | number } | [payment_method: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\Sales\PaymentMethodController::destroy
* @see app/Http/Controllers/Admin/Sales/PaymentMethodController.php:117
* @route '/admin123/payment-methods/{payment_method}'
*/
export const destroy = (args: { payment_method: string | number } | [payment_method: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin123/payment-methods/{payment_method}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\Sales\PaymentMethodController::destroy
* @see app/Http/Controllers/Admin/Sales/PaymentMethodController.php:117
* @route '/admin123/payment-methods/{payment_method}'
*/
destroy.url = (args: { payment_method: string | number } | [payment_method: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payment_method: args }
    }

    if (Array.isArray(args)) {
        args = {
            payment_method: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        payment_method: args.payment_method,
    }

    return destroy.definition.url
            .replace('{payment_method}', parsedArgs.payment_method.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Sales\PaymentMethodController::destroy
* @see app/Http/Controllers/Admin/Sales/PaymentMethodController.php:117
* @route '/admin123/payment-methods/{payment_method}'
*/
destroy.delete = (args: { payment_method: string | number } | [payment_method: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const PaymentMethodController = { destroyMany, toggleStatus, index, create, store, show, edit, update, destroy }

export default PaymentMethodController