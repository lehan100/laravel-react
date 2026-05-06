import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\Catalog\PostController::destroyMany
* @see app/Http/Controllers/Admin/Catalog/PostController.php:140
* @route '/admin123/post/destroy-many'
*/
export const destroyMany = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyMany.url(options),
    method: 'delete',
})

destroyMany.definition = {
    methods: ["delete"],
    url: '/admin123/post/destroy-many',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\Catalog\PostController::destroyMany
* @see app/Http/Controllers/Admin/Catalog/PostController.php:140
* @route '/admin123/post/destroy-many'
*/
destroyMany.url = (options?: RouteQueryOptions) => {
    return destroyMany.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Catalog\PostController::destroyMany
* @see app/Http/Controllers/Admin/Catalog/PostController.php:140
* @route '/admin123/post/destroy-many'
*/
destroyMany.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyMany.url(options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\PostController::toggleStatus
* @see app/Http/Controllers/Admin/Catalog/PostController.php:0
* @route '/admin123/post/{id}/toggle-status'
*/
export const toggleStatus = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleStatus.url(args, options),
    method: 'put',
})

toggleStatus.definition = {
    methods: ["put"],
    url: '/admin123/post/{id}/toggle-status',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\Catalog\PostController::toggleStatus
* @see app/Http/Controllers/Admin/Catalog/PostController.php:0
* @route '/admin123/post/{id}/toggle-status'
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
* @see \App\Http\Controllers\Admin\Catalog\PostController::toggleStatus
* @see app/Http/Controllers/Admin/Catalog/PostController.php:0
* @route '/admin123/post/{id}/toggle-status'
*/
toggleStatus.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleStatus.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\PostController::index
* @see app/Http/Controllers/Admin/Catalog/PostController.php:47
* @route '/admin123/post'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin123/post',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Catalog\PostController::index
* @see app/Http/Controllers/Admin/Catalog/PostController.php:47
* @route '/admin123/post'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Catalog\PostController::index
* @see app/Http/Controllers/Admin/Catalog/PostController.php:47
* @route '/admin123/post'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\PostController::index
* @see app/Http/Controllers/Admin/Catalog/PostController.php:47
* @route '/admin123/post'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\PostController::create
* @see app/Http/Controllers/Admin/Catalog/PostController.php:58
* @route '/admin123/post/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin123/post/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Catalog\PostController::create
* @see app/Http/Controllers/Admin/Catalog/PostController.php:58
* @route '/admin123/post/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Catalog\PostController::create
* @see app/Http/Controllers/Admin/Catalog/PostController.php:58
* @route '/admin123/post/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\PostController::create
* @see app/Http/Controllers/Admin/Catalog/PostController.php:58
* @route '/admin123/post/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\PostController::store
* @see app/Http/Controllers/Admin/Catalog/PostController.php:71
* @route '/admin123/post'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin123/post',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Catalog\PostController::store
* @see app/Http/Controllers/Admin/Catalog/PostController.php:71
* @route '/admin123/post'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Catalog\PostController::store
* @see app/Http/Controllers/Admin/Catalog/PostController.php:71
* @route '/admin123/post'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\PostController::show
* @see app/Http/Controllers/Admin/Catalog/PostController.php:89
* @route '/admin123/post/{post}'
*/
export const show = (args: { post: string | number } | [post: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin123/post/{post}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Catalog\PostController::show
* @see app/Http/Controllers/Admin/Catalog/PostController.php:89
* @route '/admin123/post/{post}'
*/
show.url = (args: { post: string | number } | [post: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { post: args }
    }

    if (Array.isArray(args)) {
        args = {
            post: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        post: args.post,
    }

    return show.definition.url
            .replace('{post}', parsedArgs.post.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Catalog\PostController::show
* @see app/Http/Controllers/Admin/Catalog/PostController.php:89
* @route '/admin123/post/{post}'
*/
show.get = (args: { post: string | number } | [post: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\PostController::show
* @see app/Http/Controllers/Admin/Catalog/PostController.php:89
* @route '/admin123/post/{post}'
*/
show.head = (args: { post: string | number } | [post: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\PostController::edit
* @see app/Http/Controllers/Admin/Catalog/PostController.php:94
* @route '/admin123/post/{post}/edit'
*/
export const edit = (args: { post: string | number } | [post: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin123/post/{post}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Catalog\PostController::edit
* @see app/Http/Controllers/Admin/Catalog/PostController.php:94
* @route '/admin123/post/{post}/edit'
*/
edit.url = (args: { post: string | number } | [post: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { post: args }
    }

    if (Array.isArray(args)) {
        args = {
            post: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        post: args.post,
    }

    return edit.definition.url
            .replace('{post}', parsedArgs.post.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Catalog\PostController::edit
* @see app/Http/Controllers/Admin/Catalog/PostController.php:94
* @route '/admin123/post/{post}/edit'
*/
edit.get = (args: { post: string | number } | [post: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\PostController::edit
* @see app/Http/Controllers/Admin/Catalog/PostController.php:94
* @route '/admin123/post/{post}/edit'
*/
edit.head = (args: { post: string | number } | [post: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\PostController::update
* @see app/Http/Controllers/Admin/Catalog/PostController.php:108
* @route '/admin123/post/{post}'
*/
export const update = (args: { post: string | number } | [post: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin123/post/{post}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\Catalog\PostController::update
* @see app/Http/Controllers/Admin/Catalog/PostController.php:108
* @route '/admin123/post/{post}'
*/
update.url = (args: { post: string | number } | [post: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { post: args }
    }

    if (Array.isArray(args)) {
        args = {
            post: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        post: args.post,
    }

    return update.definition.url
            .replace('{post}', parsedArgs.post.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Catalog\PostController::update
* @see app/Http/Controllers/Admin/Catalog/PostController.php:108
* @route '/admin123/post/{post}'
*/
update.put = (args: { post: string | number } | [post: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\PostController::update
* @see app/Http/Controllers/Admin/Catalog/PostController.php:108
* @route '/admin123/post/{post}'
*/
update.patch = (args: { post: string | number } | [post: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\PostController::destroy
* @see app/Http/Controllers/Admin/Catalog/PostController.php:127
* @route '/admin123/post/{post}'
*/
export const destroy = (args: { post: string | number } | [post: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin123/post/{post}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\Catalog\PostController::destroy
* @see app/Http/Controllers/Admin/Catalog/PostController.php:127
* @route '/admin123/post/{post}'
*/
destroy.url = (args: { post: string | number } | [post: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { post: args }
    }

    if (Array.isArray(args)) {
        args = {
            post: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        post: args.post,
    }

    return destroy.definition.url
            .replace('{post}', parsedArgs.post.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Catalog\PostController::destroy
* @see app/Http/Controllers/Admin/Catalog/PostController.php:127
* @route '/admin123/post/{post}'
*/
destroy.delete = (args: { post: string | number } | [post: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const post = {
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

export default post