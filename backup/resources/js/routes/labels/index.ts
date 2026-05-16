import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\Settings\LabelController::destroyMany
* @see app/Http/Controllers/Admin/Settings/LabelController.php:0
* @route '/admin123/labels/destroy-many'
*/
export const destroyMany = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyMany.url(options),
    method: 'delete',
})

destroyMany.definition = {
    methods: ["delete"],
    url: '/admin123/labels/destroy-many',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\Settings\LabelController::destroyMany
* @see app/Http/Controllers/Admin/Settings/LabelController.php:0
* @route '/admin123/labels/destroy-many'
*/
destroyMany.url = (options?: RouteQueryOptions) => {
    return destroyMany.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Settings\LabelController::destroyMany
* @see app/Http/Controllers/Admin/Settings/LabelController.php:0
* @route '/admin123/labels/destroy-many'
*/
destroyMany.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyMany.url(options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\Settings\LabelController::toggleStatus
* @see app/Http/Controllers/Admin/Settings/LabelController.php:0
* @route '/admin123/labels/{id}/toggle-status'
*/
export const toggleStatus = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleStatus.url(args, options),
    method: 'put',
})

toggleStatus.definition = {
    methods: ["put"],
    url: '/admin123/labels/{id}/toggle-status',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\Settings\LabelController::toggleStatus
* @see app/Http/Controllers/Admin/Settings/LabelController.php:0
* @route '/admin123/labels/{id}/toggle-status'
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
* @see \App\Http\Controllers\Admin\Settings\LabelController::toggleStatus
* @see app/Http/Controllers/Admin/Settings/LabelController.php:0
* @route '/admin123/labels/{id}/toggle-status'
*/
toggleStatus.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleStatus.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\Settings\LabelController::index
* @see app/Http/Controllers/Admin/Settings/LabelController.php:29
* @route '/admin123/labels'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin123/labels',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Settings\LabelController::index
* @see app/Http/Controllers/Admin/Settings/LabelController.php:29
* @route '/admin123/labels'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Settings\LabelController::index
* @see app/Http/Controllers/Admin/Settings/LabelController.php:29
* @route '/admin123/labels'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Settings\LabelController::index
* @see app/Http/Controllers/Admin/Settings/LabelController.php:29
* @route '/admin123/labels'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Settings\LabelController::create
* @see app/Http/Controllers/Admin/Settings/LabelController.php:44
* @route '/admin123/labels/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin123/labels/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Settings\LabelController::create
* @see app/Http/Controllers/Admin/Settings/LabelController.php:44
* @route '/admin123/labels/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Settings\LabelController::create
* @see app/Http/Controllers/Admin/Settings/LabelController.php:44
* @route '/admin123/labels/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Settings\LabelController::create
* @see app/Http/Controllers/Admin/Settings/LabelController.php:44
* @route '/admin123/labels/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Settings\LabelController::store
* @see app/Http/Controllers/Admin/Settings/LabelController.php:52
* @route '/admin123/labels'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin123/labels',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Settings\LabelController::store
* @see app/Http/Controllers/Admin/Settings/LabelController.php:52
* @route '/admin123/labels'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Settings\LabelController::store
* @see app/Http/Controllers/Admin/Settings/LabelController.php:52
* @route '/admin123/labels'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\Settings\LabelController::show
* @see app/Http/Controllers/Admin/Settings/LabelController.php:86
* @route '/admin123/labels/{label}'
*/
export const show = (args: { label: string | number } | [label: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin123/labels/{label}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Settings\LabelController::show
* @see app/Http/Controllers/Admin/Settings/LabelController.php:86
* @route '/admin123/labels/{label}'
*/
show.url = (args: { label: string | number } | [label: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { label: args }
    }

    if (Array.isArray(args)) {
        args = {
            label: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        label: args.label,
    }

    return show.definition.url
            .replace('{label}', parsedArgs.label.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Settings\LabelController::show
* @see app/Http/Controllers/Admin/Settings/LabelController.php:86
* @route '/admin123/labels/{label}'
*/
show.get = (args: { label: string | number } | [label: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Settings\LabelController::show
* @see app/Http/Controllers/Admin/Settings/LabelController.php:86
* @route '/admin123/labels/{label}'
*/
show.head = (args: { label: string | number } | [label: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Settings\LabelController::edit
* @see app/Http/Controllers/Admin/Settings/LabelController.php:94
* @route '/admin123/labels/{label}/edit'
*/
export const edit = (args: { label: string | number } | [label: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin123/labels/{label}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Settings\LabelController::edit
* @see app/Http/Controllers/Admin/Settings/LabelController.php:94
* @route '/admin123/labels/{label}/edit'
*/
edit.url = (args: { label: string | number } | [label: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { label: args }
    }

    if (Array.isArray(args)) {
        args = {
            label: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        label: args.label,
    }

    return edit.definition.url
            .replace('{label}', parsedArgs.label.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Settings\LabelController::edit
* @see app/Http/Controllers/Admin/Settings/LabelController.php:94
* @route '/admin123/labels/{label}/edit'
*/
edit.get = (args: { label: string | number } | [label: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Settings\LabelController::edit
* @see app/Http/Controllers/Admin/Settings/LabelController.php:94
* @route '/admin123/labels/{label}/edit'
*/
edit.head = (args: { label: string | number } | [label: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Settings\LabelController::update
* @see app/Http/Controllers/Admin/Settings/LabelController.php:102
* @route '/admin123/labels/{label}'
*/
export const update = (args: { label: string | number } | [label: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin123/labels/{label}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\Settings\LabelController::update
* @see app/Http/Controllers/Admin/Settings/LabelController.php:102
* @route '/admin123/labels/{label}'
*/
update.url = (args: { label: string | number } | [label: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { label: args }
    }

    if (Array.isArray(args)) {
        args = {
            label: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        label: args.label,
    }

    return update.definition.url
            .replace('{label}', parsedArgs.label.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Settings\LabelController::update
* @see app/Http/Controllers/Admin/Settings/LabelController.php:102
* @route '/admin123/labels/{label}'
*/
update.put = (args: { label: string | number } | [label: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\Settings\LabelController::update
* @see app/Http/Controllers/Admin/Settings/LabelController.php:102
* @route '/admin123/labels/{label}'
*/
update.patch = (args: { label: string | number } | [label: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\Settings\LabelController::destroy
* @see app/Http/Controllers/Admin/Settings/LabelController.php:110
* @route '/admin123/labels/{label}'
*/
export const destroy = (args: { label: string | number } | [label: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin123/labels/{label}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\Settings\LabelController::destroy
* @see app/Http/Controllers/Admin/Settings/LabelController.php:110
* @route '/admin123/labels/{label}'
*/
destroy.url = (args: { label: string | number } | [label: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { label: args }
    }

    if (Array.isArray(args)) {
        args = {
            label: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        label: args.label,
    }

    return destroy.definition.url
            .replace('{label}', parsedArgs.label.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Settings\LabelController::destroy
* @see app/Http/Controllers/Admin/Settings/LabelController.php:110
* @route '/admin123/labels/{label}'
*/
destroy.delete = (args: { label: string | number } | [label: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const labels = {
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

export default labels