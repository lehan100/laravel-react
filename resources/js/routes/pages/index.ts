import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\PageManager\PageController::quickStore
* @see app/Http/Controllers/Admin/PageManager/PageController.php:43
* @route '/admin123/pages/quick-store'
*/
export const quickStore = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: quickStore.url(options),
    method: 'post',
})

quickStore.definition = {
    methods: ["post"],
    url: '/admin123/pages/quick-store',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PageManager\PageController::quickStore
* @see app/Http/Controllers/Admin/PageManager/PageController.php:43
* @route '/admin123/pages/quick-store'
*/
quickStore.url = (options?: RouteQueryOptions) => {
    return quickStore.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PageManager\PageController::quickStore
* @see app/Http/Controllers/Admin/PageManager/PageController.php:43
* @route '/admin123/pages/quick-store'
*/
quickStore.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: quickStore.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\PageManager\PageController::destroyMany
* @see app/Http/Controllers/Admin/PageManager/PageController.php:98
* @route '/admin123/pages/destroy-many'
*/
export const destroyMany = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyMany.url(options),
    method: 'delete',
})

destroyMany.definition = {
    methods: ["delete"],
    url: '/admin123/pages/destroy-many',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\PageManager\PageController::destroyMany
* @see app/Http/Controllers/Admin/PageManager/PageController.php:98
* @route '/admin123/pages/destroy-many'
*/
destroyMany.url = (options?: RouteQueryOptions) => {
    return destroyMany.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PageManager\PageController::destroyMany
* @see app/Http/Controllers/Admin/PageManager/PageController.php:98
* @route '/admin123/pages/destroy-many'
*/
destroyMany.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyMany.url(options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\PageManager\PageController::toggleStatus
* @see app/Http/Controllers/Admin/PageManager/PageController.php:105
* @route '/admin123/pages/{id}/toggle-status'
*/
export const toggleStatus = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleStatus.url(args, options),
    method: 'put',
})

toggleStatus.definition = {
    methods: ["put"],
    url: '/admin123/pages/{id}/toggle-status',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\PageManager\PageController::toggleStatus
* @see app/Http/Controllers/Admin/PageManager/PageController.php:105
* @route '/admin123/pages/{id}/toggle-status'
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
* @see \App\Http\Controllers\Admin\PageManager\PageController::toggleStatus
* @see app/Http/Controllers/Admin/PageManager/PageController.php:105
* @route '/admin123/pages/{id}/toggle-status'
*/
toggleStatus.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleStatus.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\PageManager\PageController::index
* @see app/Http/Controllers/Admin/PageManager/PageController.php:22
* @route '/admin123/pages'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin123/pages',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PageManager\PageController::index
* @see app/Http/Controllers/Admin/PageManager/PageController.php:22
* @route '/admin123/pages'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PageManager\PageController::index
* @see app/Http/Controllers/Admin/PageManager/PageController.php:22
* @route '/admin123/pages'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PageManager\PageController::index
* @see app/Http/Controllers/Admin/PageManager/PageController.php:22
* @route '/admin123/pages'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\PageManager\PageController::create
* @see app/Http/Controllers/Admin/PageManager/PageController.php:31
* @route '/admin123/pages/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin123/pages/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PageManager\PageController::create
* @see app/Http/Controllers/Admin/PageManager/PageController.php:31
* @route '/admin123/pages/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PageManager\PageController::create
* @see app/Http/Controllers/Admin/PageManager/PageController.php:31
* @route '/admin123/pages/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PageManager\PageController::create
* @see app/Http/Controllers/Admin/PageManager/PageController.php:31
* @route '/admin123/pages/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\PageManager\PageController::store
* @see app/Http/Controllers/Admin/PageManager/PageController.php:36
* @route '/admin123/pages'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin123/pages',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PageManager\PageController::store
* @see app/Http/Controllers/Admin/PageManager/PageController.php:36
* @route '/admin123/pages'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PageManager\PageController::store
* @see app/Http/Controllers/Admin/PageManager/PageController.php:36
* @route '/admin123/pages'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\PageManager\PageController::show
* @see app/Http/Controllers/Admin/PageManager/PageController.php:67
* @route '/admin123/pages/{page}'
*/
export const show = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin123/pages/{page}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PageManager\PageController::show
* @see app/Http/Controllers/Admin/PageManager/PageController.php:67
* @route '/admin123/pages/{page}'
*/
show.url = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { page: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { page: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            page: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        page: typeof args.page === 'object'
        ? args.page.id
        : args.page,
    }

    return show.definition.url
            .replace('{page}', parsedArgs.page.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PageManager\PageController::show
* @see app/Http/Controllers/Admin/PageManager/PageController.php:67
* @route '/admin123/pages/{page}'
*/
show.get = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PageManager\PageController::show
* @see app/Http/Controllers/Admin/PageManager/PageController.php:67
* @route '/admin123/pages/{page}'
*/
show.head = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\PageManager\PageController::edit
* @see app/Http/Controllers/Admin/PageManager/PageController.php:77
* @route '/admin123/pages/{page}/edit'
*/
export const edit = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin123/pages/{page}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PageManager\PageController::edit
* @see app/Http/Controllers/Admin/PageManager/PageController.php:77
* @route '/admin123/pages/{page}/edit'
*/
edit.url = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { page: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { page: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            page: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        page: typeof args.page === 'object'
        ? args.page.id
        : args.page,
    }

    return edit.definition.url
            .replace('{page}', parsedArgs.page.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PageManager\PageController::edit
* @see app/Http/Controllers/Admin/PageManager/PageController.php:77
* @route '/admin123/pages/{page}/edit'
*/
edit.get = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PageManager\PageController::edit
* @see app/Http/Controllers/Admin/PageManager/PageController.php:77
* @route '/admin123/pages/{page}/edit'
*/
edit.head = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\PageManager\PageController::update
* @see app/Http/Controllers/Admin/PageManager/PageController.php:84
* @route '/admin123/pages/{page}'
*/
export const update = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin123/pages/{page}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\PageManager\PageController::update
* @see app/Http/Controllers/Admin/PageManager/PageController.php:84
* @route '/admin123/pages/{page}'
*/
update.url = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { page: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { page: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            page: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        page: typeof args.page === 'object'
        ? args.page.id
        : args.page,
    }

    return update.definition.url
            .replace('{page}', parsedArgs.page.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PageManager\PageController::update
* @see app/Http/Controllers/Admin/PageManager/PageController.php:84
* @route '/admin123/pages/{page}'
*/
update.put = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\PageManager\PageController::update
* @see app/Http/Controllers/Admin/PageManager/PageController.php:84
* @route '/admin123/pages/{page}'
*/
update.patch = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\PageManager\PageController::destroy
* @see app/Http/Controllers/Admin/PageManager/PageController.php:91
* @route '/admin123/pages/{page}'
*/
export const destroy = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin123/pages/{page}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\PageManager\PageController::destroy
* @see app/Http/Controllers/Admin/PageManager/PageController.php:91
* @route '/admin123/pages/{page}'
*/
destroy.url = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { page: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { page: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            page: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        page: typeof args.page === 'object'
        ? args.page.id
        : args.page,
    }

    return destroy.definition.url
            .replace('{page}', parsedArgs.page.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PageManager\PageController::destroy
* @see app/Http/Controllers/Admin/PageManager/PageController.php:91
* @route '/admin123/pages/{page}'
*/
destroy.delete = (args: { page: number | { id: number } } | [page: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const pages = {
    quickStore: Object.assign(quickStore, quickStore),
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

export default pages