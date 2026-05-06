import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\Media\MediaPositionController::destroyMany
* @see app/Http/Controllers/Admin/Media/MediaPositionController.php:131
* @route '/admin123/media-position/destroy-many'
*/
export const destroyMany = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyMany.url(options),
    method: 'delete',
})

destroyMany.definition = {
    methods: ["delete"],
    url: '/admin123/media-position/destroy-many',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\Media\MediaPositionController::destroyMany
* @see app/Http/Controllers/Admin/Media/MediaPositionController.php:131
* @route '/admin123/media-position/destroy-many'
*/
destroyMany.url = (options?: RouteQueryOptions) => {
    return destroyMany.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Media\MediaPositionController::destroyMany
* @see app/Http/Controllers/Admin/Media/MediaPositionController.php:131
* @route '/admin123/media-position/destroy-many'
*/
destroyMany.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyMany.url(options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\Media\MediaPositionController::toggleStatus
* @see app/Http/Controllers/Admin/Media/MediaPositionController.php:0
* @route '/admin123/media-position/{id}/toggle-status'
*/
export const toggleStatus = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleStatus.url(args, options),
    method: 'put',
})

toggleStatus.definition = {
    methods: ["put"],
    url: '/admin123/media-position/{id}/toggle-status',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\Media\MediaPositionController::toggleStatus
* @see app/Http/Controllers/Admin/Media/MediaPositionController.php:0
* @route '/admin123/media-position/{id}/toggle-status'
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
* @see \App\Http\Controllers\Admin\Media\MediaPositionController::toggleStatus
* @see app/Http/Controllers/Admin/Media/MediaPositionController.php:0
* @route '/admin123/media-position/{id}/toggle-status'
*/
toggleStatus.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleStatus.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\Media\MediaPositionController::index
* @see app/Http/Controllers/Admin/Media/MediaPositionController.php:36
* @route '/admin123/media-position'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin123/media-position',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Media\MediaPositionController::index
* @see app/Http/Controllers/Admin/Media/MediaPositionController.php:36
* @route '/admin123/media-position'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Media\MediaPositionController::index
* @see app/Http/Controllers/Admin/Media/MediaPositionController.php:36
* @route '/admin123/media-position'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Media\MediaPositionController::index
* @see app/Http/Controllers/Admin/Media/MediaPositionController.php:36
* @route '/admin123/media-position'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Media\MediaPositionController::create
* @see app/Http/Controllers/Admin/Media/MediaPositionController.php:49
* @route '/admin123/media-position/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin123/media-position/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Media\MediaPositionController::create
* @see app/Http/Controllers/Admin/Media/MediaPositionController.php:49
* @route '/admin123/media-position/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Media\MediaPositionController::create
* @see app/Http/Controllers/Admin/Media/MediaPositionController.php:49
* @route '/admin123/media-position/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Media\MediaPositionController::create
* @see app/Http/Controllers/Admin/Media/MediaPositionController.php:49
* @route '/admin123/media-position/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Media\MediaPositionController::store
* @see app/Http/Controllers/Admin/Media/MediaPositionController.php:58
* @route '/admin123/media-position'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin123/media-position',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Media\MediaPositionController::store
* @see app/Http/Controllers/Admin/Media/MediaPositionController.php:58
* @route '/admin123/media-position'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Media\MediaPositionController::store
* @see app/Http/Controllers/Admin/Media/MediaPositionController.php:58
* @route '/admin123/media-position'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\Media\MediaPositionController::show
* @see app/Http/Controllers/Admin/Media/MediaPositionController.php:78
* @route '/admin123/media-position/{media_position}'
*/
export const show = (args: { media_position: string | number } | [media_position: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin123/media-position/{media_position}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Media\MediaPositionController::show
* @see app/Http/Controllers/Admin/Media/MediaPositionController.php:78
* @route '/admin123/media-position/{media_position}'
*/
show.url = (args: { media_position: string | number } | [media_position: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { media_position: args }
    }

    if (Array.isArray(args)) {
        args = {
            media_position: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        media_position: args.media_position,
    }

    return show.definition.url
            .replace('{media_position}', parsedArgs.media_position.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Media\MediaPositionController::show
* @see app/Http/Controllers/Admin/Media/MediaPositionController.php:78
* @route '/admin123/media-position/{media_position}'
*/
show.get = (args: { media_position: string | number } | [media_position: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Media\MediaPositionController::show
* @see app/Http/Controllers/Admin/Media/MediaPositionController.php:78
* @route '/admin123/media-position/{media_position}'
*/
show.head = (args: { media_position: string | number } | [media_position: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Media\MediaPositionController::edit
* @see app/Http/Controllers/Admin/Media/MediaPositionController.php:86
* @route '/admin123/media-position/{media_position}/edit'
*/
export const edit = (args: { media_position: number | { id: number } } | [media_position: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin123/media-position/{media_position}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Media\MediaPositionController::edit
* @see app/Http/Controllers/Admin/Media/MediaPositionController.php:86
* @route '/admin123/media-position/{media_position}/edit'
*/
edit.url = (args: { media_position: number | { id: number } } | [media_position: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { media_position: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { media_position: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            media_position: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        media_position: typeof args.media_position === 'object'
        ? args.media_position.id
        : args.media_position,
    }

    return edit.definition.url
            .replace('{media_position}', parsedArgs.media_position.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Media\MediaPositionController::edit
* @see app/Http/Controllers/Admin/Media/MediaPositionController.php:86
* @route '/admin123/media-position/{media_position}/edit'
*/
edit.get = (args: { media_position: number | { id: number } } | [media_position: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Media\MediaPositionController::edit
* @see app/Http/Controllers/Admin/Media/MediaPositionController.php:86
* @route '/admin123/media-position/{media_position}/edit'
*/
edit.head = (args: { media_position: number | { id: number } } | [media_position: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Media\MediaPositionController::update
* @see app/Http/Controllers/Admin/Media/MediaPositionController.php:97
* @route '/admin123/media-position/{media_position}'
*/
export const update = (args: { media_position: string | number } | [media_position: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin123/media-position/{media_position}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\Media\MediaPositionController::update
* @see app/Http/Controllers/Admin/Media/MediaPositionController.php:97
* @route '/admin123/media-position/{media_position}'
*/
update.url = (args: { media_position: string | number } | [media_position: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { media_position: args }
    }

    if (Array.isArray(args)) {
        args = {
            media_position: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        media_position: args.media_position,
    }

    return update.definition.url
            .replace('{media_position}', parsedArgs.media_position.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Media\MediaPositionController::update
* @see app/Http/Controllers/Admin/Media/MediaPositionController.php:97
* @route '/admin123/media-position/{media_position}'
*/
update.put = (args: { media_position: string | number } | [media_position: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\Media\MediaPositionController::update
* @see app/Http/Controllers/Admin/Media/MediaPositionController.php:97
* @route '/admin123/media-position/{media_position}'
*/
update.patch = (args: { media_position: string | number } | [media_position: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\Media\MediaPositionController::destroy
* @see app/Http/Controllers/Admin/Media/MediaPositionController.php:118
* @route '/admin123/media-position/{media_position}'
*/
export const destroy = (args: { media_position: string | number } | [media_position: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin123/media-position/{media_position}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\Media\MediaPositionController::destroy
* @see app/Http/Controllers/Admin/Media/MediaPositionController.php:118
* @route '/admin123/media-position/{media_position}'
*/
destroy.url = (args: { media_position: string | number } | [media_position: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { media_position: args }
    }

    if (Array.isArray(args)) {
        args = {
            media_position: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        media_position: args.media_position,
    }

    return destroy.definition.url
            .replace('{media_position}', parsedArgs.media_position.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Media\MediaPositionController::destroy
* @see app/Http/Controllers/Admin/Media/MediaPositionController.php:118
* @route '/admin123/media-position/{media_position}'
*/
destroy.delete = (args: { media_position: string | number } | [media_position: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const MediaPositionController = { destroyMany, toggleStatus, index, create, store, show, edit, update, destroy }

export default MediaPositionController