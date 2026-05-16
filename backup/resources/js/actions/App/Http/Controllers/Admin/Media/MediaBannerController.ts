import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\Media\MediaBannerController::destroyMany
* @see app/Http/Controllers/Admin/Media/MediaBannerController.php:138
* @route '/admin123/media-banner/destroy-many'
*/
export const destroyMany = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyMany.url(options),
    method: 'delete',
})

destroyMany.definition = {
    methods: ["delete"],
    url: '/admin123/media-banner/destroy-many',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\Media\MediaBannerController::destroyMany
* @see app/Http/Controllers/Admin/Media/MediaBannerController.php:138
* @route '/admin123/media-banner/destroy-many'
*/
destroyMany.url = (options?: RouteQueryOptions) => {
    return destroyMany.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Media\MediaBannerController::destroyMany
* @see app/Http/Controllers/Admin/Media/MediaBannerController.php:138
* @route '/admin123/media-banner/destroy-many'
*/
destroyMany.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyMany.url(options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\Media\MediaBannerController::toggleStatus
* @see app/Http/Controllers/Admin/Media/MediaBannerController.php:0
* @route '/admin123/media-banner/{id}/toggle-status'
*/
export const toggleStatus = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleStatus.url(args, options),
    method: 'put',
})

toggleStatus.definition = {
    methods: ["put"],
    url: '/admin123/media-banner/{id}/toggle-status',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\Media\MediaBannerController::toggleStatus
* @see app/Http/Controllers/Admin/Media/MediaBannerController.php:0
* @route '/admin123/media-banner/{id}/toggle-status'
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
* @see \App\Http\Controllers\Admin\Media\MediaBannerController::toggleStatus
* @see app/Http/Controllers/Admin/Media/MediaBannerController.php:0
* @route '/admin123/media-banner/{id}/toggle-status'
*/
toggleStatus.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleStatus.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\Media\MediaBannerController::index
* @see app/Http/Controllers/Admin/Media/MediaBannerController.php:41
* @route '/admin123/media-banner'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin123/media-banner',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Media\MediaBannerController::index
* @see app/Http/Controllers/Admin/Media/MediaBannerController.php:41
* @route '/admin123/media-banner'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Media\MediaBannerController::index
* @see app/Http/Controllers/Admin/Media/MediaBannerController.php:41
* @route '/admin123/media-banner'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Media\MediaBannerController::index
* @see app/Http/Controllers/Admin/Media/MediaBannerController.php:41
* @route '/admin123/media-banner'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Media\MediaBannerController::create
* @see app/Http/Controllers/Admin/Media/MediaBannerController.php:54
* @route '/admin123/media-banner/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin123/media-banner/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Media\MediaBannerController::create
* @see app/Http/Controllers/Admin/Media/MediaBannerController.php:54
* @route '/admin123/media-banner/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Media\MediaBannerController::create
* @see app/Http/Controllers/Admin/Media/MediaBannerController.php:54
* @route '/admin123/media-banner/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Media\MediaBannerController::create
* @see app/Http/Controllers/Admin/Media/MediaBannerController.php:54
* @route '/admin123/media-banner/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Media\MediaBannerController::store
* @see app/Http/Controllers/Admin/Media/MediaBannerController.php:65
* @route '/admin123/media-banner'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin123/media-banner',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Media\MediaBannerController::store
* @see app/Http/Controllers/Admin/Media/MediaBannerController.php:65
* @route '/admin123/media-banner'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Media\MediaBannerController::store
* @see app/Http/Controllers/Admin/Media/MediaBannerController.php:65
* @route '/admin123/media-banner'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\Media\MediaBannerController::show
* @see app/Http/Controllers/Admin/Media/MediaBannerController.php:85
* @route '/admin123/media-banner/{media_banner}'
*/
export const show = (args: { media_banner: string | number } | [media_banner: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin123/media-banner/{media_banner}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Media\MediaBannerController::show
* @see app/Http/Controllers/Admin/Media/MediaBannerController.php:85
* @route '/admin123/media-banner/{media_banner}'
*/
show.url = (args: { media_banner: string | number } | [media_banner: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { media_banner: args }
    }

    if (Array.isArray(args)) {
        args = {
            media_banner: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        media_banner: args.media_banner,
    }

    return show.definition.url
            .replace('{media_banner}', parsedArgs.media_banner.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Media\MediaBannerController::show
* @see app/Http/Controllers/Admin/Media/MediaBannerController.php:85
* @route '/admin123/media-banner/{media_banner}'
*/
show.get = (args: { media_banner: string | number } | [media_banner: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Media\MediaBannerController::show
* @see app/Http/Controllers/Admin/Media/MediaBannerController.php:85
* @route '/admin123/media-banner/{media_banner}'
*/
show.head = (args: { media_banner: string | number } | [media_banner: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Media\MediaBannerController::edit
* @see app/Http/Controllers/Admin/Media/MediaBannerController.php:93
* @route '/admin123/media-banner/{media_banner}/edit'
*/
export const edit = (args: { media_banner: number | { id: number } } | [media_banner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin123/media-banner/{media_banner}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Media\MediaBannerController::edit
* @see app/Http/Controllers/Admin/Media/MediaBannerController.php:93
* @route '/admin123/media-banner/{media_banner}/edit'
*/
edit.url = (args: { media_banner: number | { id: number } } | [media_banner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { media_banner: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { media_banner: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            media_banner: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        media_banner: typeof args.media_banner === 'object'
        ? args.media_banner.id
        : args.media_banner,
    }

    return edit.definition.url
            .replace('{media_banner}', parsedArgs.media_banner.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Media\MediaBannerController::edit
* @see app/Http/Controllers/Admin/Media/MediaBannerController.php:93
* @route '/admin123/media-banner/{media_banner}/edit'
*/
edit.get = (args: { media_banner: number | { id: number } } | [media_banner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Media\MediaBannerController::edit
* @see app/Http/Controllers/Admin/Media/MediaBannerController.php:93
* @route '/admin123/media-banner/{media_banner}/edit'
*/
edit.head = (args: { media_banner: number | { id: number } } | [media_banner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Media\MediaBannerController::update
* @see app/Http/Controllers/Admin/Media/MediaBannerController.php:104
* @route '/admin123/media-banner/{media_banner}'
*/
export const update = (args: { media_banner: string | number } | [media_banner: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin123/media-banner/{media_banner}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\Media\MediaBannerController::update
* @see app/Http/Controllers/Admin/Media/MediaBannerController.php:104
* @route '/admin123/media-banner/{media_banner}'
*/
update.url = (args: { media_banner: string | number } | [media_banner: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { media_banner: args }
    }

    if (Array.isArray(args)) {
        args = {
            media_banner: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        media_banner: args.media_banner,
    }

    return update.definition.url
            .replace('{media_banner}', parsedArgs.media_banner.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Media\MediaBannerController::update
* @see app/Http/Controllers/Admin/Media/MediaBannerController.php:104
* @route '/admin123/media-banner/{media_banner}'
*/
update.put = (args: { media_banner: string | number } | [media_banner: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\Media\MediaBannerController::update
* @see app/Http/Controllers/Admin/Media/MediaBannerController.php:104
* @route '/admin123/media-banner/{media_banner}'
*/
update.patch = (args: { media_banner: string | number } | [media_banner: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\Media\MediaBannerController::destroy
* @see app/Http/Controllers/Admin/Media/MediaBannerController.php:125
* @route '/admin123/media-banner/{media_banner}'
*/
export const destroy = (args: { media_banner: string | number } | [media_banner: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin123/media-banner/{media_banner}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\Media\MediaBannerController::destroy
* @see app/Http/Controllers/Admin/Media/MediaBannerController.php:125
* @route '/admin123/media-banner/{media_banner}'
*/
destroy.url = (args: { media_banner: string | number } | [media_banner: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { media_banner: args }
    }

    if (Array.isArray(args)) {
        args = {
            media_banner: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        media_banner: args.media_banner,
    }

    return destroy.definition.url
            .replace('{media_banner}', parsedArgs.media_banner.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Media\MediaBannerController::destroy
* @see app/Http/Controllers/Admin/Media/MediaBannerController.php:125
* @route '/admin123/media-banner/{media_banner}'
*/
destroy.delete = (args: { media_banner: string | number } | [media_banner: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const MediaBannerController = { destroyMany, toggleStatus, index, create, store, show, edit, update, destroy }

export default MediaBannerController