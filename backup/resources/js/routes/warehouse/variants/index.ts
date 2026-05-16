import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\Sales\WarehouseController::edit
* @see app/Http/Controllers/Admin/Sales/WarehouseController.php:109
* @route '/admin123/warehouse/variants/{variant}/edit'
*/
export const edit = (args: { variant: string | number } | [variant: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin123/warehouse/variants/{variant}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Sales\WarehouseController::edit
* @see app/Http/Controllers/Admin/Sales/WarehouseController.php:109
* @route '/admin123/warehouse/variants/{variant}/edit'
*/
edit.url = (args: { variant: string | number } | [variant: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { variant: args }
    }

    if (Array.isArray(args)) {
        args = {
            variant: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        variant: args.variant,
    }

    return edit.definition.url
            .replace('{variant}', parsedArgs.variant.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Sales\WarehouseController::edit
* @see app/Http/Controllers/Admin/Sales/WarehouseController.php:109
* @route '/admin123/warehouse/variants/{variant}/edit'
*/
edit.get = (args: { variant: string | number } | [variant: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Sales\WarehouseController::edit
* @see app/Http/Controllers/Admin/Sales/WarehouseController.php:109
* @route '/admin123/warehouse/variants/{variant}/edit'
*/
edit.head = (args: { variant: string | number } | [variant: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Sales\WarehouseController::update
* @see app/Http/Controllers/Admin/Sales/WarehouseController.php:134
* @route '/admin123/warehouse/variants/{variant}'
*/
export const update = (args: { variant: string | number } | [variant: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin123/warehouse/variants/{variant}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\Sales\WarehouseController::update
* @see app/Http/Controllers/Admin/Sales/WarehouseController.php:134
* @route '/admin123/warehouse/variants/{variant}'
*/
update.url = (args: { variant: string | number } | [variant: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { variant: args }
    }

    if (Array.isArray(args)) {
        args = {
            variant: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        variant: args.variant,
    }

    return update.definition.url
            .replace('{variant}', parsedArgs.variant.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Sales\WarehouseController::update
* @see app/Http/Controllers/Admin/Sales/WarehouseController.php:134
* @route '/admin123/warehouse/variants/{variant}'
*/
update.put = (args: { variant: string | number } | [variant: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\Sales\WarehouseController::toggleStock
* @see app/Http/Controllers/Admin/Sales/WarehouseController.php:174
* @route '/admin123/warehouse/variants/{variant}/toggle-stock'
*/
export const toggleStock = (args: { variant: string | number } | [variant: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleStock.url(args, options),
    method: 'put',
})

toggleStock.definition = {
    methods: ["put"],
    url: '/admin123/warehouse/variants/{variant}/toggle-stock',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\Sales\WarehouseController::toggleStock
* @see app/Http/Controllers/Admin/Sales/WarehouseController.php:174
* @route '/admin123/warehouse/variants/{variant}/toggle-stock'
*/
toggleStock.url = (args: { variant: string | number } | [variant: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { variant: args }
    }

    if (Array.isArray(args)) {
        args = {
            variant: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        variant: args.variant,
    }

    return toggleStock.definition.url
            .replace('{variant}', parsedArgs.variant.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Sales\WarehouseController::toggleStock
* @see app/Http/Controllers/Admin/Sales/WarehouseController.php:174
* @route '/admin123/warehouse/variants/{variant}/toggle-stock'
*/
toggleStock.put = (args: { variant: string | number } | [variant: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleStock.url(args, options),
    method: 'put',
})

const variants = {
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    toggleStock: Object.assign(toggleStock, toggleStock),
}

export default variants