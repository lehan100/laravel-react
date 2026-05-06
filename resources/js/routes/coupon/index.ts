import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\Promotion\CouponController::productsPicker
* @see app/Http/Controllers/Admin/Promotion/CouponController.php:135
* @route '/admin123/coupon/products-picker'
*/
export const productsPicker = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: productsPicker.url(options),
    method: 'get',
})

productsPicker.definition = {
    methods: ["get","head"],
    url: '/admin123/coupon/products-picker',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Promotion\CouponController::productsPicker
* @see app/Http/Controllers/Admin/Promotion/CouponController.php:135
* @route '/admin123/coupon/products-picker'
*/
productsPicker.url = (options?: RouteQueryOptions) => {
    return productsPicker.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Promotion\CouponController::productsPicker
* @see app/Http/Controllers/Admin/Promotion/CouponController.php:135
* @route '/admin123/coupon/products-picker'
*/
productsPicker.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: productsPicker.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\CouponController::productsPicker
* @see app/Http/Controllers/Admin/Promotion/CouponController.php:135
* @route '/admin123/coupon/products-picker'
*/
productsPicker.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: productsPicker.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\CouponController::destroyMany
* @see app/Http/Controllers/Admin/Promotion/CouponController.php:182
* @route '/admin123/coupon/destroy-many'
*/
export const destroyMany = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyMany.url(options),
    method: 'delete',
})

destroyMany.definition = {
    methods: ["delete"],
    url: '/admin123/coupon/destroy-many',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\Promotion\CouponController::destroyMany
* @see app/Http/Controllers/Admin/Promotion/CouponController.php:182
* @route '/admin123/coupon/destroy-many'
*/
destroyMany.url = (options?: RouteQueryOptions) => {
    return destroyMany.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Promotion\CouponController::destroyMany
* @see app/Http/Controllers/Admin/Promotion/CouponController.php:182
* @route '/admin123/coupon/destroy-many'
*/
destroyMany.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyMany.url(options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\CouponController::toggleStatus
* @see app/Http/Controllers/Admin/Promotion/CouponController.php:0
* @route '/admin123/coupon/{id}/toggle-status'
*/
export const toggleStatus = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleStatus.url(args, options),
    method: 'put',
})

toggleStatus.definition = {
    methods: ["put"],
    url: '/admin123/coupon/{id}/toggle-status',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\Promotion\CouponController::toggleStatus
* @see app/Http/Controllers/Admin/Promotion/CouponController.php:0
* @route '/admin123/coupon/{id}/toggle-status'
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
* @see \App\Http\Controllers\Admin\Promotion\CouponController::toggleStatus
* @see app/Http/Controllers/Admin/Promotion/CouponController.php:0
* @route '/admin123/coupon/{id}/toggle-status'
*/
toggleStatus.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleStatus.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\CouponController::index
* @see app/Http/Controllers/Admin/Promotion/CouponController.php:39
* @route '/admin123/coupon'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin123/coupon',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Promotion\CouponController::index
* @see app/Http/Controllers/Admin/Promotion/CouponController.php:39
* @route '/admin123/coupon'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Promotion\CouponController::index
* @see app/Http/Controllers/Admin/Promotion/CouponController.php:39
* @route '/admin123/coupon'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\CouponController::index
* @see app/Http/Controllers/Admin/Promotion/CouponController.php:39
* @route '/admin123/coupon'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\CouponController::create
* @see app/Http/Controllers/Admin/Promotion/CouponController.php:49
* @route '/admin123/coupon/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin123/coupon/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Promotion\CouponController::create
* @see app/Http/Controllers/Admin/Promotion/CouponController.php:49
* @route '/admin123/coupon/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Promotion\CouponController::create
* @see app/Http/Controllers/Admin/Promotion/CouponController.php:49
* @route '/admin123/coupon/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\CouponController::create
* @see app/Http/Controllers/Admin/Promotion/CouponController.php:49
* @route '/admin123/coupon/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\CouponController::store
* @see app/Http/Controllers/Admin/Promotion/CouponController.php:63
* @route '/admin123/coupon'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin123/coupon',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Promotion\CouponController::store
* @see app/Http/Controllers/Admin/Promotion/CouponController.php:63
* @route '/admin123/coupon'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Promotion\CouponController::store
* @see app/Http/Controllers/Admin/Promotion/CouponController.php:63
* @route '/admin123/coupon'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\CouponController::show
* @see app/Http/Controllers/Admin/Promotion/CouponController.php:82
* @route '/admin123/coupon/{coupon}'
*/
export const show = (args: { coupon: string | number } | [coupon: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin123/coupon/{coupon}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Promotion\CouponController::show
* @see app/Http/Controllers/Admin/Promotion/CouponController.php:82
* @route '/admin123/coupon/{coupon}'
*/
show.url = (args: { coupon: string | number } | [coupon: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { coupon: args }
    }

    if (Array.isArray(args)) {
        args = {
            coupon: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        coupon: args.coupon,
    }

    return show.definition.url
            .replace('{coupon}', parsedArgs.coupon.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Promotion\CouponController::show
* @see app/Http/Controllers/Admin/Promotion/CouponController.php:82
* @route '/admin123/coupon/{coupon}'
*/
show.get = (args: { coupon: string | number } | [coupon: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\CouponController::show
* @see app/Http/Controllers/Admin/Promotion/CouponController.php:82
* @route '/admin123/coupon/{coupon}'
*/
show.head = (args: { coupon: string | number } | [coupon: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\CouponController::edit
* @see app/Http/Controllers/Admin/Promotion/CouponController.php:118
* @route '/admin123/coupon/{coupon}/edit'
*/
export const edit = (args: { coupon: string | number } | [coupon: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin123/coupon/{coupon}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Promotion\CouponController::edit
* @see app/Http/Controllers/Admin/Promotion/CouponController.php:118
* @route '/admin123/coupon/{coupon}/edit'
*/
edit.url = (args: { coupon: string | number } | [coupon: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { coupon: args }
    }

    if (Array.isArray(args)) {
        args = {
            coupon: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        coupon: args.coupon,
    }

    return edit.definition.url
            .replace('{coupon}', parsedArgs.coupon.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Promotion\CouponController::edit
* @see app/Http/Controllers/Admin/Promotion/CouponController.php:118
* @route '/admin123/coupon/{coupon}/edit'
*/
edit.get = (args: { coupon: string | number } | [coupon: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\CouponController::edit
* @see app/Http/Controllers/Admin/Promotion/CouponController.php:118
* @route '/admin123/coupon/{coupon}/edit'
*/
edit.head = (args: { coupon: string | number } | [coupon: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\CouponController::update
* @see app/Http/Controllers/Admin/Promotion/CouponController.php:150
* @route '/admin123/coupon/{coupon}'
*/
export const update = (args: { coupon: string | number } | [coupon: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin123/coupon/{coupon}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\Promotion\CouponController::update
* @see app/Http/Controllers/Admin/Promotion/CouponController.php:150
* @route '/admin123/coupon/{coupon}'
*/
update.url = (args: { coupon: string | number } | [coupon: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { coupon: args }
    }

    if (Array.isArray(args)) {
        args = {
            coupon: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        coupon: args.coupon,
    }

    return update.definition.url
            .replace('{coupon}', parsedArgs.coupon.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Promotion\CouponController::update
* @see app/Http/Controllers/Admin/Promotion/CouponController.php:150
* @route '/admin123/coupon/{coupon}'
*/
update.put = (args: { coupon: string | number } | [coupon: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\CouponController::update
* @see app/Http/Controllers/Admin/Promotion/CouponController.php:150
* @route '/admin123/coupon/{coupon}'
*/
update.patch = (args: { coupon: string | number } | [coupon: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\CouponController::destroy
* @see app/Http/Controllers/Admin/Promotion/CouponController.php:170
* @route '/admin123/coupon/{coupon}'
*/
export const destroy = (args: { coupon: string | number } | [coupon: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin123/coupon/{coupon}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\Promotion\CouponController::destroy
* @see app/Http/Controllers/Admin/Promotion/CouponController.php:170
* @route '/admin123/coupon/{coupon}'
*/
destroy.url = (args: { coupon: string | number } | [coupon: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { coupon: args }
    }

    if (Array.isArray(args)) {
        args = {
            coupon: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        coupon: args.coupon,
    }

    return destroy.definition.url
            .replace('{coupon}', parsedArgs.coupon.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Promotion\CouponController::destroy
* @see app/Http/Controllers/Admin/Promotion/CouponController.php:170
* @route '/admin123/coupon/{coupon}'
*/
destroy.delete = (args: { coupon: string | number } | [coupon: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const coupon = {
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

export default coupon