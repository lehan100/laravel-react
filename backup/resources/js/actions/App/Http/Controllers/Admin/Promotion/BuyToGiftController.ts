import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\Promotion\BuyToGiftController::productsPicker
* @see app/Http/Controllers/Admin/Promotion/BuyToGiftController.php:143
* @route '/admin123/buytogift/products-picker'
*/
export const productsPicker = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: productsPicker.url(options),
    method: 'get',
})

productsPicker.definition = {
    methods: ["get","head"],
    url: '/admin123/buytogift/products-picker',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Promotion\BuyToGiftController::productsPicker
* @see app/Http/Controllers/Admin/Promotion/BuyToGiftController.php:143
* @route '/admin123/buytogift/products-picker'
*/
productsPicker.url = (options?: RouteQueryOptions) => {
    return productsPicker.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Promotion\BuyToGiftController::productsPicker
* @see app/Http/Controllers/Admin/Promotion/BuyToGiftController.php:143
* @route '/admin123/buytogift/products-picker'
*/
productsPicker.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: productsPicker.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\BuyToGiftController::productsPicker
* @see app/Http/Controllers/Admin/Promotion/BuyToGiftController.php:143
* @route '/admin123/buytogift/products-picker'
*/
productsPicker.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: productsPicker.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\BuyToGiftController::destroyMany
* @see app/Http/Controllers/Admin/Promotion/BuyToGiftController.php:195
* @route '/admin123/buytogift/destroy-many'
*/
export const destroyMany = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyMany.url(options),
    method: 'delete',
})

destroyMany.definition = {
    methods: ["delete"],
    url: '/admin123/buytogift/destroy-many',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\Promotion\BuyToGiftController::destroyMany
* @see app/Http/Controllers/Admin/Promotion/BuyToGiftController.php:195
* @route '/admin123/buytogift/destroy-many'
*/
destroyMany.url = (options?: RouteQueryOptions) => {
    return destroyMany.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Promotion\BuyToGiftController::destroyMany
* @see app/Http/Controllers/Admin/Promotion/BuyToGiftController.php:195
* @route '/admin123/buytogift/destroy-many'
*/
destroyMany.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyMany.url(options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\BuyToGiftController::toggleStatus
* @see app/Http/Controllers/Admin/Promotion/BuyToGiftController.php:0
* @route '/admin123/buytogift/{id}/toggle-status'
*/
export const toggleStatus = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleStatus.url(args, options),
    method: 'put',
})

toggleStatus.definition = {
    methods: ["put"],
    url: '/admin123/buytogift/{id}/toggle-status',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\Promotion\BuyToGiftController::toggleStatus
* @see app/Http/Controllers/Admin/Promotion/BuyToGiftController.php:0
* @route '/admin123/buytogift/{id}/toggle-status'
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
* @see \App\Http\Controllers\Admin\Promotion\BuyToGiftController::toggleStatus
* @see app/Http/Controllers/Admin/Promotion/BuyToGiftController.php:0
* @route '/admin123/buytogift/{id}/toggle-status'
*/
toggleStatus.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleStatus.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\BuyToGiftController::index
* @see app/Http/Controllers/Admin/Promotion/BuyToGiftController.php:44
* @route '/admin123/buytogift'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin123/buytogift',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Promotion\BuyToGiftController::index
* @see app/Http/Controllers/Admin/Promotion/BuyToGiftController.php:44
* @route '/admin123/buytogift'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Promotion\BuyToGiftController::index
* @see app/Http/Controllers/Admin/Promotion/BuyToGiftController.php:44
* @route '/admin123/buytogift'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\BuyToGiftController::index
* @see app/Http/Controllers/Admin/Promotion/BuyToGiftController.php:44
* @route '/admin123/buytogift'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\BuyToGiftController::create
* @see app/Http/Controllers/Admin/Promotion/BuyToGiftController.php:54
* @route '/admin123/buytogift/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin123/buytogift/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Promotion\BuyToGiftController::create
* @see app/Http/Controllers/Admin/Promotion/BuyToGiftController.php:54
* @route '/admin123/buytogift/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Promotion\BuyToGiftController::create
* @see app/Http/Controllers/Admin/Promotion/BuyToGiftController.php:54
* @route '/admin123/buytogift/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\BuyToGiftController::create
* @see app/Http/Controllers/Admin/Promotion/BuyToGiftController.php:54
* @route '/admin123/buytogift/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\BuyToGiftController::store
* @see app/Http/Controllers/Admin/Promotion/BuyToGiftController.php:73
* @route '/admin123/buytogift'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin123/buytogift',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Promotion\BuyToGiftController::store
* @see app/Http/Controllers/Admin/Promotion/BuyToGiftController.php:73
* @route '/admin123/buytogift'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Promotion\BuyToGiftController::store
* @see app/Http/Controllers/Admin/Promotion/BuyToGiftController.php:73
* @route '/admin123/buytogift'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\BuyToGiftController::show
* @see app/Http/Controllers/Admin/Promotion/BuyToGiftController.php:97
* @route '/admin123/buytogift/{buytogift}'
*/
export const show = (args: { buytogift: string | number } | [buytogift: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin123/buytogift/{buytogift}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Promotion\BuyToGiftController::show
* @see app/Http/Controllers/Admin/Promotion/BuyToGiftController.php:97
* @route '/admin123/buytogift/{buytogift}'
*/
show.url = (args: { buytogift: string | number } | [buytogift: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { buytogift: args }
    }

    if (Array.isArray(args)) {
        args = {
            buytogift: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        buytogift: args.buytogift,
    }

    return show.definition.url
            .replace('{buytogift}', parsedArgs.buytogift.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Promotion\BuyToGiftController::show
* @see app/Http/Controllers/Admin/Promotion/BuyToGiftController.php:97
* @route '/admin123/buytogift/{buytogift}'
*/
show.get = (args: { buytogift: string | number } | [buytogift: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\BuyToGiftController::show
* @see app/Http/Controllers/Admin/Promotion/BuyToGiftController.php:97
* @route '/admin123/buytogift/{buytogift}'
*/
show.head = (args: { buytogift: string | number } | [buytogift: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\BuyToGiftController::edit
* @see app/Http/Controllers/Admin/Promotion/BuyToGiftController.php:114
* @route '/admin123/buytogift/{buytogift}/edit'
*/
export const edit = (args: { buytogift: string | number } | [buytogift: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin123/buytogift/{buytogift}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Promotion\BuyToGiftController::edit
* @see app/Http/Controllers/Admin/Promotion/BuyToGiftController.php:114
* @route '/admin123/buytogift/{buytogift}/edit'
*/
edit.url = (args: { buytogift: string | number } | [buytogift: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { buytogift: args }
    }

    if (Array.isArray(args)) {
        args = {
            buytogift: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        buytogift: args.buytogift,
    }

    return edit.definition.url
            .replace('{buytogift}', parsedArgs.buytogift.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Promotion\BuyToGiftController::edit
* @see app/Http/Controllers/Admin/Promotion/BuyToGiftController.php:114
* @route '/admin123/buytogift/{buytogift}/edit'
*/
edit.get = (args: { buytogift: string | number } | [buytogift: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\BuyToGiftController::edit
* @see app/Http/Controllers/Admin/Promotion/BuyToGiftController.php:114
* @route '/admin123/buytogift/{buytogift}/edit'
*/
edit.head = (args: { buytogift: string | number } | [buytogift: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\BuyToGiftController::update
* @see app/Http/Controllers/Admin/Promotion/BuyToGiftController.php:158
* @route '/admin123/buytogift/{buytogift}'
*/
export const update = (args: { buytogift: string | number } | [buytogift: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin123/buytogift/{buytogift}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\Promotion\BuyToGiftController::update
* @see app/Http/Controllers/Admin/Promotion/BuyToGiftController.php:158
* @route '/admin123/buytogift/{buytogift}'
*/
update.url = (args: { buytogift: string | number } | [buytogift: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { buytogift: args }
    }

    if (Array.isArray(args)) {
        args = {
            buytogift: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        buytogift: args.buytogift,
    }

    return update.definition.url
            .replace('{buytogift}', parsedArgs.buytogift.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Promotion\BuyToGiftController::update
* @see app/Http/Controllers/Admin/Promotion/BuyToGiftController.php:158
* @route '/admin123/buytogift/{buytogift}'
*/
update.put = (args: { buytogift: string | number } | [buytogift: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\BuyToGiftController::update
* @see app/Http/Controllers/Admin/Promotion/BuyToGiftController.php:158
* @route '/admin123/buytogift/{buytogift}'
*/
update.patch = (args: { buytogift: string | number } | [buytogift: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\BuyToGiftController::destroy
* @see app/Http/Controllers/Admin/Promotion/BuyToGiftController.php:183
* @route '/admin123/buytogift/{buytogift}'
*/
export const destroy = (args: { buytogift: string | number } | [buytogift: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin123/buytogift/{buytogift}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\Promotion\BuyToGiftController::destroy
* @see app/Http/Controllers/Admin/Promotion/BuyToGiftController.php:183
* @route '/admin123/buytogift/{buytogift}'
*/
destroy.url = (args: { buytogift: string | number } | [buytogift: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { buytogift: args }
    }

    if (Array.isArray(args)) {
        args = {
            buytogift: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        buytogift: args.buytogift,
    }

    return destroy.definition.url
            .replace('{buytogift}', parsedArgs.buytogift.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Promotion\BuyToGiftController::destroy
* @see app/Http/Controllers/Admin/Promotion/BuyToGiftController.php:183
* @route '/admin123/buytogift/{buytogift}'
*/
destroy.delete = (args: { buytogift: string | number } | [buytogift: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const BuyToGiftController = { productsPicker, destroyMany, toggleStatus, index, create, store, show, edit, update, destroy }

export default BuyToGiftController