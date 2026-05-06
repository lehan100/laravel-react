import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\PageManager\FieldGroupController::destroyMany
* @see app/Http/Controllers/Admin/PageManager/FieldGroupController.php:72
* @route '/admin123/page-schemas/destroy-many'
*/
export const destroyMany = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyMany.url(options),
    method: 'delete',
})

destroyMany.definition = {
    methods: ["delete"],
    url: '/admin123/page-schemas/destroy-many',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\PageManager\FieldGroupController::destroyMany
* @see app/Http/Controllers/Admin/PageManager/FieldGroupController.php:72
* @route '/admin123/page-schemas/destroy-many'
*/
destroyMany.url = (options?: RouteQueryOptions) => {
    return destroyMany.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PageManager\FieldGroupController::destroyMany
* @see app/Http/Controllers/Admin/PageManager/FieldGroupController.php:72
* @route '/admin123/page-schemas/destroy-many'
*/
destroyMany.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyMany.url(options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\PageManager\FieldGroupController::toggleStatus
* @see app/Http/Controllers/Admin/PageManager/FieldGroupController.php:79
* @route '/admin123/page-schemas/{id}/toggle-status'
*/
export const toggleStatus = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleStatus.url(args, options),
    method: 'put',
})

toggleStatus.definition = {
    methods: ["put"],
    url: '/admin123/page-schemas/{id}/toggle-status',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\PageManager\FieldGroupController::toggleStatus
* @see app/Http/Controllers/Admin/PageManager/FieldGroupController.php:79
* @route '/admin123/page-schemas/{id}/toggle-status'
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
* @see \App\Http\Controllers\Admin\PageManager\FieldGroupController::toggleStatus
* @see app/Http/Controllers/Admin/PageManager/FieldGroupController.php:79
* @route '/admin123/page-schemas/{id}/toggle-status'
*/
toggleStatus.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleStatus.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\PageManager\FieldGroupController::index
* @see app/Http/Controllers/Admin/PageManager/FieldGroupController.php:20
* @route '/admin123/page-schemas'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin123/page-schemas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PageManager\FieldGroupController::index
* @see app/Http/Controllers/Admin/PageManager/FieldGroupController.php:20
* @route '/admin123/page-schemas'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PageManager\FieldGroupController::index
* @see app/Http/Controllers/Admin/PageManager/FieldGroupController.php:20
* @route '/admin123/page-schemas'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PageManager\FieldGroupController::index
* @see app/Http/Controllers/Admin/PageManager/FieldGroupController.php:20
* @route '/admin123/page-schemas'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\PageManager\FieldGroupController::create
* @see app/Http/Controllers/Admin/PageManager/FieldGroupController.php:29
* @route '/admin123/page-schemas/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin123/page-schemas/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PageManager\FieldGroupController::create
* @see app/Http/Controllers/Admin/PageManager/FieldGroupController.php:29
* @route '/admin123/page-schemas/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PageManager\FieldGroupController::create
* @see app/Http/Controllers/Admin/PageManager/FieldGroupController.php:29
* @route '/admin123/page-schemas/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PageManager\FieldGroupController::create
* @see app/Http/Controllers/Admin/PageManager/FieldGroupController.php:29
* @route '/admin123/page-schemas/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\PageManager\FieldGroupController::store
* @see app/Http/Controllers/Admin/PageManager/FieldGroupController.php:34
* @route '/admin123/page-schemas'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin123/page-schemas',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PageManager\FieldGroupController::store
* @see app/Http/Controllers/Admin/PageManager/FieldGroupController.php:34
* @route '/admin123/page-schemas'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PageManager\FieldGroupController::store
* @see app/Http/Controllers/Admin/PageManager/FieldGroupController.php:34
* @route '/admin123/page-schemas'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\PageManager\FieldGroupController::show
* @see app/Http/Controllers/Admin/PageManager/FieldGroupController.php:41
* @route '/admin123/page-schemas/{field_group}'
*/
export const show = (args: { field_group: number | { id: number } } | [field_group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin123/page-schemas/{field_group}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PageManager\FieldGroupController::show
* @see app/Http/Controllers/Admin/PageManager/FieldGroupController.php:41
* @route '/admin123/page-schemas/{field_group}'
*/
show.url = (args: { field_group: number | { id: number } } | [field_group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { field_group: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { field_group: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            field_group: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        field_group: typeof args.field_group === 'object'
        ? args.field_group.id
        : args.field_group,
    }

    return show.definition.url
            .replace('{field_group}', parsedArgs.field_group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PageManager\FieldGroupController::show
* @see app/Http/Controllers/Admin/PageManager/FieldGroupController.php:41
* @route '/admin123/page-schemas/{field_group}'
*/
show.get = (args: { field_group: number | { id: number } } | [field_group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PageManager\FieldGroupController::show
* @see app/Http/Controllers/Admin/PageManager/FieldGroupController.php:41
* @route '/admin123/page-schemas/{field_group}'
*/
show.head = (args: { field_group: number | { id: number } } | [field_group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\PageManager\FieldGroupController::edit
* @see app/Http/Controllers/Admin/PageManager/FieldGroupController.php:49
* @route '/admin123/page-schemas/{field_group}/edit'
*/
export const edit = (args: { field_group: number | { id: number } } | [field_group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin123/page-schemas/{field_group}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PageManager\FieldGroupController::edit
* @see app/Http/Controllers/Admin/PageManager/FieldGroupController.php:49
* @route '/admin123/page-schemas/{field_group}/edit'
*/
edit.url = (args: { field_group: number | { id: number } } | [field_group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { field_group: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { field_group: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            field_group: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        field_group: typeof args.field_group === 'object'
        ? args.field_group.id
        : args.field_group,
    }

    return edit.definition.url
            .replace('{field_group}', parsedArgs.field_group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PageManager\FieldGroupController::edit
* @see app/Http/Controllers/Admin/PageManager/FieldGroupController.php:49
* @route '/admin123/page-schemas/{field_group}/edit'
*/
edit.get = (args: { field_group: number | { id: number } } | [field_group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PageManager\FieldGroupController::edit
* @see app/Http/Controllers/Admin/PageManager/FieldGroupController.php:49
* @route '/admin123/page-schemas/{field_group}/edit'
*/
edit.head = (args: { field_group: number | { id: number } } | [field_group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\PageManager\FieldGroupController::update
* @see app/Http/Controllers/Admin/PageManager/FieldGroupController.php:54
* @route '/admin123/page-schemas/{field_group}'
*/
export const update = (args: { field_group: number | { id: number } } | [field_group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin123/page-schemas/{field_group}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\PageManager\FieldGroupController::update
* @see app/Http/Controllers/Admin/PageManager/FieldGroupController.php:54
* @route '/admin123/page-schemas/{field_group}'
*/
update.url = (args: { field_group: number | { id: number } } | [field_group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { field_group: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { field_group: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            field_group: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        field_group: typeof args.field_group === 'object'
        ? args.field_group.id
        : args.field_group,
    }

    return update.definition.url
            .replace('{field_group}', parsedArgs.field_group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PageManager\FieldGroupController::update
* @see app/Http/Controllers/Admin/PageManager/FieldGroupController.php:54
* @route '/admin123/page-schemas/{field_group}'
*/
update.put = (args: { field_group: number | { id: number } } | [field_group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\PageManager\FieldGroupController::update
* @see app/Http/Controllers/Admin/PageManager/FieldGroupController.php:54
* @route '/admin123/page-schemas/{field_group}'
*/
update.patch = (args: { field_group: number | { id: number } } | [field_group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\PageManager\FieldGroupController::destroy
* @see app/Http/Controllers/Admin/PageManager/FieldGroupController.php:61
* @route '/admin123/page-schemas/{field_group}'
*/
export const destroy = (args: { field_group: number | { id: number } } | [field_group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin123/page-schemas/{field_group}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\PageManager\FieldGroupController::destroy
* @see app/Http/Controllers/Admin/PageManager/FieldGroupController.php:61
* @route '/admin123/page-schemas/{field_group}'
*/
destroy.url = (args: { field_group: number | { id: number } } | [field_group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { field_group: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { field_group: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            field_group: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        field_group: typeof args.field_group === 'object'
        ? args.field_group.id
        : args.field_group,
    }

    return destroy.definition.url
            .replace('{field_group}', parsedArgs.field_group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PageManager\FieldGroupController::destroy
* @see app/Http/Controllers/Admin/PageManager/FieldGroupController.php:61
* @route '/admin123/page-schemas/{field_group}'
*/
destroy.delete = (args: { field_group: number | { id: number } } | [field_group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const FieldGroupController = { destroyMany, toggleStatus, index, create, store, show, edit, update, destroy }

export default FieldGroupController