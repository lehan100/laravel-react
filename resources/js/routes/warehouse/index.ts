import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
import variants from './variants'
/**
* @see \App\Http\Controllers\Admin\Sales\WarehouseController::toggleStock
* @see app/Http/Controllers/Admin/Sales/WarehouseController.php:150
* @route '/admin123/warehouse/{id}/toggle-stock'
*/
export const toggleStock = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleStock.url(args, options),
    method: 'put',
})

toggleStock.definition = {
    methods: ["put"],
    url: '/admin123/warehouse/{id}/toggle-stock',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\Sales\WarehouseController::toggleStock
* @see app/Http/Controllers/Admin/Sales/WarehouseController.php:150
* @route '/admin123/warehouse/{id}/toggle-stock'
*/
toggleStock.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return toggleStock.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Sales\WarehouseController::toggleStock
* @see app/Http/Controllers/Admin/Sales/WarehouseController.php:150
* @route '/admin123/warehouse/{id}/toggle-stock'
*/
toggleStock.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleStock.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\Sales\WarehouseController::destroyMany
* @see app/Http/Controllers/Admin/Sales/WarehouseController.php:179
* @route '/admin123/warehouse/destroy-many'
*/
export const destroyMany = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyMany.url(options),
    method: 'delete',
})

destroyMany.definition = {
    methods: ["delete"],
    url: '/admin123/warehouse/destroy-many',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\Sales\WarehouseController::destroyMany
* @see app/Http/Controllers/Admin/Sales/WarehouseController.php:179
* @route '/admin123/warehouse/destroy-many'
*/
destroyMany.url = (options?: RouteQueryOptions) => {
    return destroyMany.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Sales\WarehouseController::destroyMany
* @see app/Http/Controllers/Admin/Sales/WarehouseController.php:179
* @route '/admin123/warehouse/destroy-many'
*/
destroyMany.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyMany.url(options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\Sales\WarehouseController::toggleStatus
* @see app/Http/Controllers/Admin/Sales/WarehouseController.php:0
* @route '/admin123/warehouse/{id}/toggle-status'
*/
export const toggleStatus = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleStatus.url(args, options),
    method: 'put',
})

toggleStatus.definition = {
    methods: ["put"],
    url: '/admin123/warehouse/{id}/toggle-status',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\Sales\WarehouseController::toggleStatus
* @see app/Http/Controllers/Admin/Sales/WarehouseController.php:0
* @route '/admin123/warehouse/{id}/toggle-status'
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
* @see \App\Http\Controllers\Admin\Sales\WarehouseController::toggleStatus
* @see app/Http/Controllers/Admin/Sales/WarehouseController.php:0
* @route '/admin123/warehouse/{id}/toggle-status'
*/
toggleStatus.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleStatus.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\Sales\WarehouseController::index
* @see app/Http/Controllers/Admin/Sales/WarehouseController.php:33
* @route '/admin123/warehouse'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin123/warehouse',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Sales\WarehouseController::index
* @see app/Http/Controllers/Admin/Sales/WarehouseController.php:33
* @route '/admin123/warehouse'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Sales\WarehouseController::index
* @see app/Http/Controllers/Admin/Sales/WarehouseController.php:33
* @route '/admin123/warehouse'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Sales\WarehouseController::index
* @see app/Http/Controllers/Admin/Sales/WarehouseController.php:33
* @route '/admin123/warehouse'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Sales\WarehouseController::create
* @see app/Http/Controllers/Admin/Sales/WarehouseController.php:52
* @route '/admin123/warehouse/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin123/warehouse/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Sales\WarehouseController::create
* @see app/Http/Controllers/Admin/Sales/WarehouseController.php:52
* @route '/admin123/warehouse/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Sales\WarehouseController::create
* @see app/Http/Controllers/Admin/Sales/WarehouseController.php:52
* @route '/admin123/warehouse/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Sales\WarehouseController::create
* @see app/Http/Controllers/Admin/Sales/WarehouseController.php:52
* @route '/admin123/warehouse/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Sales\WarehouseController::store
* @see app/Http/Controllers/Admin/Sales/WarehouseController.php:57
* @route '/admin123/warehouse'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin123/warehouse',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Sales\WarehouseController::store
* @see app/Http/Controllers/Admin/Sales/WarehouseController.php:57
* @route '/admin123/warehouse'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Sales\WarehouseController::store
* @see app/Http/Controllers/Admin/Sales/WarehouseController.php:57
* @route '/admin123/warehouse'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\Sales\WarehouseController::show
* @see app/Http/Controllers/Admin/Sales/WarehouseController.php:62
* @route '/admin123/warehouse/{warehouse}'
*/
export const show = (args: { warehouse: string | number } | [warehouse: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin123/warehouse/{warehouse}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Sales\WarehouseController::show
* @see app/Http/Controllers/Admin/Sales/WarehouseController.php:62
* @route '/admin123/warehouse/{warehouse}'
*/
show.url = (args: { warehouse: string | number } | [warehouse: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { warehouse: args }
    }

    if (Array.isArray(args)) {
        args = {
            warehouse: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        warehouse: args.warehouse,
    }

    return show.definition.url
            .replace('{warehouse}', parsedArgs.warehouse.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Sales\WarehouseController::show
* @see app/Http/Controllers/Admin/Sales/WarehouseController.php:62
* @route '/admin123/warehouse/{warehouse}'
*/
show.get = (args: { warehouse: string | number } | [warehouse: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Sales\WarehouseController::show
* @see app/Http/Controllers/Admin/Sales/WarehouseController.php:62
* @route '/admin123/warehouse/{warehouse}'
*/
show.head = (args: { warehouse: string | number } | [warehouse: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Sales\WarehouseController::edit
* @see app/Http/Controllers/Admin/Sales/WarehouseController.php:67
* @route '/admin123/warehouse/{warehouse}/edit'
*/
export const edit = (args: { warehouse: string | number } | [warehouse: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin123/warehouse/{warehouse}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Sales\WarehouseController::edit
* @see app/Http/Controllers/Admin/Sales/WarehouseController.php:67
* @route '/admin123/warehouse/{warehouse}/edit'
*/
edit.url = (args: { warehouse: string | number } | [warehouse: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { warehouse: args }
    }

    if (Array.isArray(args)) {
        args = {
            warehouse: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        warehouse: args.warehouse,
    }

    return edit.definition.url
            .replace('{warehouse}', parsedArgs.warehouse.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Sales\WarehouseController::edit
* @see app/Http/Controllers/Admin/Sales/WarehouseController.php:67
* @route '/admin123/warehouse/{warehouse}/edit'
*/
edit.get = (args: { warehouse: string | number } | [warehouse: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Sales\WarehouseController::edit
* @see app/Http/Controllers/Admin/Sales/WarehouseController.php:67
* @route '/admin123/warehouse/{warehouse}/edit'
*/
edit.head = (args: { warehouse: string | number } | [warehouse: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Sales\WarehouseController::update
* @see app/Http/Controllers/Admin/Sales/WarehouseController.php:84
* @route '/admin123/warehouse/{warehouse}'
*/
export const update = (args: { warehouse: string | number } | [warehouse: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin123/warehouse/{warehouse}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\Sales\WarehouseController::update
* @see app/Http/Controllers/Admin/Sales/WarehouseController.php:84
* @route '/admin123/warehouse/{warehouse}'
*/
update.url = (args: { warehouse: string | number } | [warehouse: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { warehouse: args }
    }

    if (Array.isArray(args)) {
        args = {
            warehouse: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        warehouse: args.warehouse,
    }

    return update.definition.url
            .replace('{warehouse}', parsedArgs.warehouse.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Sales\WarehouseController::update
* @see app/Http/Controllers/Admin/Sales/WarehouseController.php:84
* @route '/admin123/warehouse/{warehouse}'
*/
update.put = (args: { warehouse: string | number } | [warehouse: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\Sales\WarehouseController::update
* @see app/Http/Controllers/Admin/Sales/WarehouseController.php:84
* @route '/admin123/warehouse/{warehouse}'
*/
update.patch = (args: { warehouse: string | number } | [warehouse: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\Sales\WarehouseController::destroy
* @see app/Http/Controllers/Admin/Sales/WarehouseController.php:174
* @route '/admin123/warehouse/{warehouse}'
*/
export const destroy = (args: { warehouse: string | number } | [warehouse: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin123/warehouse/{warehouse}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\Sales\WarehouseController::destroy
* @see app/Http/Controllers/Admin/Sales/WarehouseController.php:174
* @route '/admin123/warehouse/{warehouse}'
*/
destroy.url = (args: { warehouse: string | number } | [warehouse: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { warehouse: args }
    }

    if (Array.isArray(args)) {
        args = {
            warehouse: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        warehouse: args.warehouse,
    }

    return destroy.definition.url
            .replace('{warehouse}', parsedArgs.warehouse.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Sales\WarehouseController::destroy
* @see app/Http/Controllers/Admin/Sales/WarehouseController.php:174
* @route '/admin123/warehouse/{warehouse}'
*/
destroy.delete = (args: { warehouse: string | number } | [warehouse: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const warehouse = {
    toggleStock: Object.assign(toggleStock, toggleStock),
    variants: Object.assign(variants, variants),
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

export default warehouse