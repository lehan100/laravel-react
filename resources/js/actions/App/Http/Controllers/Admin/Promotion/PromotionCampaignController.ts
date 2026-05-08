import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\Promotion\PromotionCampaignController::publicShow
* @see app/Http/Controllers/Admin/Promotion/PromotionCampaignController.php:187
* @route '/flash-sale/{slug}'
*/
export const publicShow = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: publicShow.url(args, options),
    method: 'get',
})

publicShow.definition = {
    methods: ["get","head"],
    url: '/flash-sale/{slug}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Promotion\PromotionCampaignController::publicShow
* @see app/Http/Controllers/Admin/Promotion/PromotionCampaignController.php:187
* @route '/flash-sale/{slug}'
*/
publicShow.url = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { slug: args }
    }

    if (Array.isArray(args)) {
        args = {
            slug: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        slug: args.slug,
    }

    return publicShow.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Promotion\PromotionCampaignController::publicShow
* @see app/Http/Controllers/Admin/Promotion/PromotionCampaignController.php:187
* @route '/flash-sale/{slug}'
*/
publicShow.get = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: publicShow.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\PromotionCampaignController::publicShow
* @see app/Http/Controllers/Admin/Promotion/PromotionCampaignController.php:187
* @route '/flash-sale/{slug}'
*/
publicShow.head = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: publicShow.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\PromotionCampaignController::destroyMany
* @see app/Http/Controllers/Admin/Promotion/PromotionCampaignController.php:174
* @route '/admin123/promotion-campaign/destroy-many'
*/
export const destroyMany = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyMany.url(options),
    method: 'delete',
})

destroyMany.definition = {
    methods: ["delete"],
    url: '/admin123/promotion-campaign/destroy-many',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\Promotion\PromotionCampaignController::destroyMany
* @see app/Http/Controllers/Admin/Promotion/PromotionCampaignController.php:174
* @route '/admin123/promotion-campaign/destroy-many'
*/
destroyMany.url = (options?: RouteQueryOptions) => {
    return destroyMany.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Promotion\PromotionCampaignController::destroyMany
* @see app/Http/Controllers/Admin/Promotion/PromotionCampaignController.php:174
* @route '/admin123/promotion-campaign/destroy-many'
*/
destroyMany.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyMany.url(options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\PromotionCampaignController::toggleStatus
* @see app/Http/Controllers/Admin/Promotion/PromotionCampaignController.php:0
* @route '/admin123/promotion-campaign/{id}/toggle-status'
*/
export const toggleStatus = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleStatus.url(args, options),
    method: 'put',
})

toggleStatus.definition = {
    methods: ["put"],
    url: '/admin123/promotion-campaign/{id}/toggle-status',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\Promotion\PromotionCampaignController::toggleStatus
* @see app/Http/Controllers/Admin/Promotion/PromotionCampaignController.php:0
* @route '/admin123/promotion-campaign/{id}/toggle-status'
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
* @see \App\Http\Controllers\Admin\Promotion\PromotionCampaignController::toggleStatus
* @see app/Http/Controllers/Admin/Promotion/PromotionCampaignController.php:0
* @route '/admin123/promotion-campaign/{id}/toggle-status'
*/
toggleStatus.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleStatus.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\PromotionCampaignController::index
* @see app/Http/Controllers/Admin/Promotion/PromotionCampaignController.php:46
* @route '/admin123/promotion-campaign'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin123/promotion-campaign',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Promotion\PromotionCampaignController::index
* @see app/Http/Controllers/Admin/Promotion/PromotionCampaignController.php:46
* @route '/admin123/promotion-campaign'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Promotion\PromotionCampaignController::index
* @see app/Http/Controllers/Admin/Promotion/PromotionCampaignController.php:46
* @route '/admin123/promotion-campaign'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\PromotionCampaignController::index
* @see app/Http/Controllers/Admin/Promotion/PromotionCampaignController.php:46
* @route '/admin123/promotion-campaign'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\PromotionCampaignController::create
* @see app/Http/Controllers/Admin/Promotion/PromotionCampaignController.php:56
* @route '/admin123/promotion-campaign/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin123/promotion-campaign/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Promotion\PromotionCampaignController::create
* @see app/Http/Controllers/Admin/Promotion/PromotionCampaignController.php:56
* @route '/admin123/promotion-campaign/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Promotion\PromotionCampaignController::create
* @see app/Http/Controllers/Admin/Promotion/PromotionCampaignController.php:56
* @route '/admin123/promotion-campaign/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\PromotionCampaignController::create
* @see app/Http/Controllers/Admin/Promotion/PromotionCampaignController.php:56
* @route '/admin123/promotion-campaign/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\PromotionCampaignController::store
* @see app/Http/Controllers/Admin/Promotion/PromotionCampaignController.php:70
* @route '/admin123/promotion-campaign'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin123/promotion-campaign',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Promotion\PromotionCampaignController::store
* @see app/Http/Controllers/Admin/Promotion/PromotionCampaignController.php:70
* @route '/admin123/promotion-campaign'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Promotion\PromotionCampaignController::store
* @see app/Http/Controllers/Admin/Promotion/PromotionCampaignController.php:70
* @route '/admin123/promotion-campaign'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\PromotionCampaignController::show
* @see app/Http/Controllers/Admin/Promotion/PromotionCampaignController.php:89
* @route '/admin123/promotion-campaign/{promotion_campaign}'
*/
export const show = (args: { promotion_campaign: string | number } | [promotion_campaign: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin123/promotion-campaign/{promotion_campaign}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Promotion\PromotionCampaignController::show
* @see app/Http/Controllers/Admin/Promotion/PromotionCampaignController.php:89
* @route '/admin123/promotion-campaign/{promotion_campaign}'
*/
show.url = (args: { promotion_campaign: string | number } | [promotion_campaign: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { promotion_campaign: args }
    }

    if (Array.isArray(args)) {
        args = {
            promotion_campaign: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        promotion_campaign: args.promotion_campaign,
    }

    return show.definition.url
            .replace('{promotion_campaign}', parsedArgs.promotion_campaign.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Promotion\PromotionCampaignController::show
* @see app/Http/Controllers/Admin/Promotion/PromotionCampaignController.php:89
* @route '/admin123/promotion-campaign/{promotion_campaign}'
*/
show.get = (args: { promotion_campaign: string | number } | [promotion_campaign: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\PromotionCampaignController::show
* @see app/Http/Controllers/Admin/Promotion/PromotionCampaignController.php:89
* @route '/admin123/promotion-campaign/{promotion_campaign}'
*/
show.head = (args: { promotion_campaign: string | number } | [promotion_campaign: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\PromotionCampaignController::edit
* @see app/Http/Controllers/Admin/Promotion/PromotionCampaignController.php:103
* @route '/admin123/promotion-campaign/{promotion_campaign}/edit'
*/
export const edit = (args: { promotion_campaign: string | number } | [promotion_campaign: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin123/promotion-campaign/{promotion_campaign}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Promotion\PromotionCampaignController::edit
* @see app/Http/Controllers/Admin/Promotion/PromotionCampaignController.php:103
* @route '/admin123/promotion-campaign/{promotion_campaign}/edit'
*/
edit.url = (args: { promotion_campaign: string | number } | [promotion_campaign: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { promotion_campaign: args }
    }

    if (Array.isArray(args)) {
        args = {
            promotion_campaign: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        promotion_campaign: args.promotion_campaign,
    }

    return edit.definition.url
            .replace('{promotion_campaign}', parsedArgs.promotion_campaign.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Promotion\PromotionCampaignController::edit
* @see app/Http/Controllers/Admin/Promotion/PromotionCampaignController.php:103
* @route '/admin123/promotion-campaign/{promotion_campaign}/edit'
*/
edit.get = (args: { promotion_campaign: string | number } | [promotion_campaign: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\PromotionCampaignController::edit
* @see app/Http/Controllers/Admin/Promotion/PromotionCampaignController.php:103
* @route '/admin123/promotion-campaign/{promotion_campaign}/edit'
*/
edit.head = (args: { promotion_campaign: string | number } | [promotion_campaign: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\PromotionCampaignController::update
* @see app/Http/Controllers/Admin/Promotion/PromotionCampaignController.php:142
* @route '/admin123/promotion-campaign/{promotion_campaign}'
*/
export const update = (args: { promotion_campaign: string | number } | [promotion_campaign: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin123/promotion-campaign/{promotion_campaign}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\Promotion\PromotionCampaignController::update
* @see app/Http/Controllers/Admin/Promotion/PromotionCampaignController.php:142
* @route '/admin123/promotion-campaign/{promotion_campaign}'
*/
update.url = (args: { promotion_campaign: string | number } | [promotion_campaign: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { promotion_campaign: args }
    }

    if (Array.isArray(args)) {
        args = {
            promotion_campaign: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        promotion_campaign: args.promotion_campaign,
    }

    return update.definition.url
            .replace('{promotion_campaign}', parsedArgs.promotion_campaign.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Promotion\PromotionCampaignController::update
* @see app/Http/Controllers/Admin/Promotion/PromotionCampaignController.php:142
* @route '/admin123/promotion-campaign/{promotion_campaign}'
*/
update.put = (args: { promotion_campaign: string | number } | [promotion_campaign: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\PromotionCampaignController::update
* @see app/Http/Controllers/Admin/Promotion/PromotionCampaignController.php:142
* @route '/admin123/promotion-campaign/{promotion_campaign}'
*/
update.patch = (args: { promotion_campaign: string | number } | [promotion_campaign: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\Promotion\PromotionCampaignController::destroy
* @see app/Http/Controllers/Admin/Promotion/PromotionCampaignController.php:162
* @route '/admin123/promotion-campaign/{promotion_campaign}'
*/
export const destroy = (args: { promotion_campaign: string | number } | [promotion_campaign: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin123/promotion-campaign/{promotion_campaign}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\Promotion\PromotionCampaignController::destroy
* @see app/Http/Controllers/Admin/Promotion/PromotionCampaignController.php:162
* @route '/admin123/promotion-campaign/{promotion_campaign}'
*/
destroy.url = (args: { promotion_campaign: string | number } | [promotion_campaign: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { promotion_campaign: args }
    }

    if (Array.isArray(args)) {
        args = {
            promotion_campaign: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        promotion_campaign: args.promotion_campaign,
    }

    return destroy.definition.url
            .replace('{promotion_campaign}', parsedArgs.promotion_campaign.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Promotion\PromotionCampaignController::destroy
* @see app/Http/Controllers/Admin/Promotion/PromotionCampaignController.php:162
* @route '/admin123/promotion-campaign/{promotion_campaign}'
*/
destroy.delete = (args: { promotion_campaign: string | number } | [promotion_campaign: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const PromotionCampaignController = { publicShow, destroyMany, toggleStatus, index, create, store, show, edit, update, destroy }

export default PromotionCampaignController