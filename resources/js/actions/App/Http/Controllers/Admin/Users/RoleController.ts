import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\Users\RoleController::permissions
* @see app/Http/Controllers/Admin/Users/RoleController.php:120
* @route '/admin123/roles/permissions/{id}'
*/
export const permissions = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: permissions.url(args, options),
    method: 'get',
})

permissions.definition = {
    methods: ["get","head"],
    url: '/admin123/roles/permissions/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Users\RoleController::permissions
* @see app/Http/Controllers/Admin/Users/RoleController.php:120
* @route '/admin123/roles/permissions/{id}'
*/
permissions.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return permissions.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Users\RoleController::permissions
* @see app/Http/Controllers/Admin/Users/RoleController.php:120
* @route '/admin123/roles/permissions/{id}'
*/
permissions.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: permissions.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Users\RoleController::permissions
* @see app/Http/Controllers/Admin/Users/RoleController.php:120
* @route '/admin123/roles/permissions/{id}'
*/
permissions.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: permissions.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Users\RoleController::destroyMany
* @see app/Http/Controllers/Admin/Users/RoleController.php:106
* @route '/admin123/roles/destroy-many'
*/
export const destroyMany = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyMany.url(options),
    method: 'delete',
})

destroyMany.definition = {
    methods: ["delete"],
    url: '/admin123/roles/destroy-many',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\Users\RoleController::destroyMany
* @see app/Http/Controllers/Admin/Users/RoleController.php:106
* @route '/admin123/roles/destroy-many'
*/
destroyMany.url = (options?: RouteQueryOptions) => {
    return destroyMany.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Users\RoleController::destroyMany
* @see app/Http/Controllers/Admin/Users/RoleController.php:106
* @route '/admin123/roles/destroy-many'
*/
destroyMany.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyMany.url(options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\Users\RoleController::toggleStatus
* @see app/Http/Controllers/Admin/Users/RoleController.php:0
* @route '/admin123/roles/{id}/toggle-status'
*/
export const toggleStatus = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleStatus.url(args, options),
    method: 'put',
})

toggleStatus.definition = {
    methods: ["put"],
    url: '/admin123/roles/{id}/toggle-status',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\Users\RoleController::toggleStatus
* @see app/Http/Controllers/Admin/Users/RoleController.php:0
* @route '/admin123/roles/{id}/toggle-status'
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
* @see \App\Http\Controllers\Admin\Users\RoleController::toggleStatus
* @see app/Http/Controllers/Admin/Users/RoleController.php:0
* @route '/admin123/roles/{id}/toggle-status'
*/
toggleStatus.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleStatus.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\Users\RoleController::index
* @see app/Http/Controllers/Admin/Users/RoleController.php:26
* @route '/admin123/roles'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin123/roles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Users\RoleController::index
* @see app/Http/Controllers/Admin/Users/RoleController.php:26
* @route '/admin123/roles'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Users\RoleController::index
* @see app/Http/Controllers/Admin/Users/RoleController.php:26
* @route '/admin123/roles'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Users\RoleController::index
* @see app/Http/Controllers/Admin/Users/RoleController.php:26
* @route '/admin123/roles'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Users\RoleController::create
* @see app/Http/Controllers/Admin/Users/RoleController.php:35
* @route '/admin123/roles/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin123/roles/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Users\RoleController::create
* @see app/Http/Controllers/Admin/Users/RoleController.php:35
* @route '/admin123/roles/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Users\RoleController::create
* @see app/Http/Controllers/Admin/Users/RoleController.php:35
* @route '/admin123/roles/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Users\RoleController::create
* @see app/Http/Controllers/Admin/Users/RoleController.php:35
* @route '/admin123/roles/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Users\RoleController::store
* @see app/Http/Controllers/Admin/Users/RoleController.php:44
* @route '/admin123/roles'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin123/roles',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Users\RoleController::store
* @see app/Http/Controllers/Admin/Users/RoleController.php:44
* @route '/admin123/roles'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Users\RoleController::store
* @see app/Http/Controllers/Admin/Users/RoleController.php:44
* @route '/admin123/roles'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\Users\RoleController::show
* @see app/Http/Controllers/Admin/Users/RoleController.php:0
* @route '/admin123/roles/{role}'
*/
export const show = (args: { role: string | number } | [role: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin123/roles/{role}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Users\RoleController::show
* @see app/Http/Controllers/Admin/Users/RoleController.php:0
* @route '/admin123/roles/{role}'
*/
show.url = (args: { role: string | number } | [role: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { role: args }
    }

    if (Array.isArray(args)) {
        args = {
            role: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        role: args.role,
    }

    return show.definition.url
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Users\RoleController::show
* @see app/Http/Controllers/Admin/Users/RoleController.php:0
* @route '/admin123/roles/{role}'
*/
show.get = (args: { role: string | number } | [role: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Users\RoleController::show
* @see app/Http/Controllers/Admin/Users/RoleController.php:0
* @route '/admin123/roles/{role}'
*/
show.head = (args: { role: string | number } | [role: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Users\RoleController::edit
* @see app/Http/Controllers/Admin/Users/RoleController.php:72
* @route '/admin123/roles/{role}/edit'
*/
export const edit = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin123/roles/{role}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Users\RoleController::edit
* @see app/Http/Controllers/Admin/Users/RoleController.php:72
* @route '/admin123/roles/{role}/edit'
*/
edit.url = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { role: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { role: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            role: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        role: typeof args.role === 'object'
        ? args.role.id
        : args.role,
    }

    return edit.definition.url
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Users\RoleController::edit
* @see app/Http/Controllers/Admin/Users/RoleController.php:72
* @route '/admin123/roles/{role}/edit'
*/
edit.get = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Users\RoleController::edit
* @see app/Http/Controllers/Admin/Users/RoleController.php:72
* @route '/admin123/roles/{role}/edit'
*/
edit.head = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Users\RoleController::update
* @see app/Http/Controllers/Admin/Users/RoleController.php:85
* @route '/admin123/roles/{role}'
*/
export const update = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin123/roles/{role}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\Users\RoleController::update
* @see app/Http/Controllers/Admin/Users/RoleController.php:85
* @route '/admin123/roles/{role}'
*/
update.url = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { role: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { role: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            role: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        role: typeof args.role === 'object'
        ? args.role.id
        : args.role,
    }

    return update.definition.url
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Users\RoleController::update
* @see app/Http/Controllers/Admin/Users/RoleController.php:85
* @route '/admin123/roles/{role}'
*/
update.put = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\Users\RoleController::update
* @see app/Http/Controllers/Admin/Users/RoleController.php:85
* @route '/admin123/roles/{role}'
*/
update.patch = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\Users\RoleController::destroy
* @see app/Http/Controllers/Admin/Users/RoleController.php:65
* @route '/admin123/roles/{role}'
*/
export const destroy = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin123/roles/{role}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\Users\RoleController::destroy
* @see app/Http/Controllers/Admin/Users/RoleController.php:65
* @route '/admin123/roles/{role}'
*/
destroy.url = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { role: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { role: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            role: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        role: typeof args.role === 'object'
        ? args.role.id
        : args.role,
    }

    return destroy.definition.url
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Users\RoleController::destroy
* @see app/Http/Controllers/Admin/Users/RoleController.php:65
* @route '/admin123/roles/{role}'
*/
destroy.delete = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const RoleController = { permissions, destroyMany, toggleStatus, index, create, store, show, edit, update, destroy }

export default RoleController