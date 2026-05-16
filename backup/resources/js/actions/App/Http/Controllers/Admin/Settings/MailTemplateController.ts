import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\Settings\MailTemplateController::destroyMany
* @see app/Http/Controllers/Admin/Settings/MailTemplateController.php:132
* @route '/admin123/mail-templates/destroy-many'
*/
export const destroyMany = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyMany.url(options),
    method: 'delete',
})

destroyMany.definition = {
    methods: ["delete"],
    url: '/admin123/mail-templates/destroy-many',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\Settings\MailTemplateController::destroyMany
* @see app/Http/Controllers/Admin/Settings/MailTemplateController.php:132
* @route '/admin123/mail-templates/destroy-many'
*/
destroyMany.url = (options?: RouteQueryOptions) => {
    return destroyMany.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Settings\MailTemplateController::destroyMany
* @see app/Http/Controllers/Admin/Settings/MailTemplateController.php:132
* @route '/admin123/mail-templates/destroy-many'
*/
destroyMany.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyMany.url(options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\Settings\MailTemplateController::toggleStatus
* @see app/Http/Controllers/Admin/Settings/MailTemplateController.php:145
* @route '/admin123/mail-templates/{id}/toggle-status'
*/
export const toggleStatus = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleStatus.url(args, options),
    method: 'put',
})

toggleStatus.definition = {
    methods: ["put"],
    url: '/admin123/mail-templates/{id}/toggle-status',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\Settings\MailTemplateController::toggleStatus
* @see app/Http/Controllers/Admin/Settings/MailTemplateController.php:145
* @route '/admin123/mail-templates/{id}/toggle-status'
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
* @see \App\Http\Controllers\Admin\Settings\MailTemplateController::toggleStatus
* @see app/Http/Controllers/Admin/Settings/MailTemplateController.php:145
* @route '/admin123/mail-templates/{id}/toggle-status'
*/
toggleStatus.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleStatus.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\Settings\MailTemplateController::index
* @see app/Http/Controllers/Admin/Settings/MailTemplateController.php:37
* @route '/admin123/mail-templates'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin123/mail-templates',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Settings\MailTemplateController::index
* @see app/Http/Controllers/Admin/Settings/MailTemplateController.php:37
* @route '/admin123/mail-templates'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Settings\MailTemplateController::index
* @see app/Http/Controllers/Admin/Settings/MailTemplateController.php:37
* @route '/admin123/mail-templates'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Settings\MailTemplateController::index
* @see app/Http/Controllers/Admin/Settings/MailTemplateController.php:37
* @route '/admin123/mail-templates'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Settings\MailTemplateController::create
* @see app/Http/Controllers/Admin/Settings/MailTemplateController.php:47
* @route '/admin123/mail-templates/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin123/mail-templates/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Settings\MailTemplateController::create
* @see app/Http/Controllers/Admin/Settings/MailTemplateController.php:47
* @route '/admin123/mail-templates/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Settings\MailTemplateController::create
* @see app/Http/Controllers/Admin/Settings/MailTemplateController.php:47
* @route '/admin123/mail-templates/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Settings\MailTemplateController::create
* @see app/Http/Controllers/Admin/Settings/MailTemplateController.php:47
* @route '/admin123/mail-templates/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Settings\MailTemplateController::store
* @see app/Http/Controllers/Admin/Settings/MailTemplateController.php:59
* @route '/admin123/mail-templates'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin123/mail-templates',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Settings\MailTemplateController::store
* @see app/Http/Controllers/Admin/Settings/MailTemplateController.php:59
* @route '/admin123/mail-templates'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Settings\MailTemplateController::store
* @see app/Http/Controllers/Admin/Settings/MailTemplateController.php:59
* @route '/admin123/mail-templates'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\Settings\MailTemplateController::show
* @see app/Http/Controllers/Admin/Settings/MailTemplateController.php:78
* @route '/admin123/mail-templates/{mail_template}'
*/
export const show = (args: { mail_template: string | number } | [mail_template: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin123/mail-templates/{mail_template}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Settings\MailTemplateController::show
* @see app/Http/Controllers/Admin/Settings/MailTemplateController.php:78
* @route '/admin123/mail-templates/{mail_template}'
*/
show.url = (args: { mail_template: string | number } | [mail_template: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { mail_template: args }
    }

    if (Array.isArray(args)) {
        args = {
            mail_template: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        mail_template: args.mail_template,
    }

    return show.definition.url
            .replace('{mail_template}', parsedArgs.mail_template.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Settings\MailTemplateController::show
* @see app/Http/Controllers/Admin/Settings/MailTemplateController.php:78
* @route '/admin123/mail-templates/{mail_template}'
*/
show.get = (args: { mail_template: string | number } | [mail_template: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Settings\MailTemplateController::show
* @see app/Http/Controllers/Admin/Settings/MailTemplateController.php:78
* @route '/admin123/mail-templates/{mail_template}'
*/
show.head = (args: { mail_template: string | number } | [mail_template: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Settings\MailTemplateController::edit
* @see app/Http/Controllers/Admin/Settings/MailTemplateController.php:83
* @route '/admin123/mail-templates/{mail_template}/edit'
*/
export const edit = (args: { mail_template: string | number } | [mail_template: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin123/mail-templates/{mail_template}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Settings\MailTemplateController::edit
* @see app/Http/Controllers/Admin/Settings/MailTemplateController.php:83
* @route '/admin123/mail-templates/{mail_template}/edit'
*/
edit.url = (args: { mail_template: string | number } | [mail_template: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { mail_template: args }
    }

    if (Array.isArray(args)) {
        args = {
            mail_template: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        mail_template: args.mail_template,
    }

    return edit.definition.url
            .replace('{mail_template}', parsedArgs.mail_template.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Settings\MailTemplateController::edit
* @see app/Http/Controllers/Admin/Settings/MailTemplateController.php:83
* @route '/admin123/mail-templates/{mail_template}/edit'
*/
edit.get = (args: { mail_template: string | number } | [mail_template: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Settings\MailTemplateController::edit
* @see app/Http/Controllers/Admin/Settings/MailTemplateController.php:83
* @route '/admin123/mail-templates/{mail_template}/edit'
*/
edit.head = (args: { mail_template: string | number } | [mail_template: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Settings\MailTemplateController::update
* @see app/Http/Controllers/Admin/Settings/MailTemplateController.php:99
* @route '/admin123/mail-templates/{mail_template}'
*/
export const update = (args: { mail_template: string | number } | [mail_template: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin123/mail-templates/{mail_template}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\Settings\MailTemplateController::update
* @see app/Http/Controllers/Admin/Settings/MailTemplateController.php:99
* @route '/admin123/mail-templates/{mail_template}'
*/
update.url = (args: { mail_template: string | number } | [mail_template: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { mail_template: args }
    }

    if (Array.isArray(args)) {
        args = {
            mail_template: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        mail_template: args.mail_template,
    }

    return update.definition.url
            .replace('{mail_template}', parsedArgs.mail_template.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Settings\MailTemplateController::update
* @see app/Http/Controllers/Admin/Settings/MailTemplateController.php:99
* @route '/admin123/mail-templates/{mail_template}'
*/
update.put = (args: { mail_template: string | number } | [mail_template: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\Settings\MailTemplateController::update
* @see app/Http/Controllers/Admin/Settings/MailTemplateController.php:99
* @route '/admin123/mail-templates/{mail_template}'
*/
update.patch = (args: { mail_template: string | number } | [mail_template: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\Settings\MailTemplateController::destroy
* @see app/Http/Controllers/Admin/Settings/MailTemplateController.php:119
* @route '/admin123/mail-templates/{mail_template}'
*/
export const destroy = (args: { mail_template: string | number } | [mail_template: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin123/mail-templates/{mail_template}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\Settings\MailTemplateController::destroy
* @see app/Http/Controllers/Admin/Settings/MailTemplateController.php:119
* @route '/admin123/mail-templates/{mail_template}'
*/
destroy.url = (args: { mail_template: string | number } | [mail_template: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { mail_template: args }
    }

    if (Array.isArray(args)) {
        args = {
            mail_template: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        mail_template: args.mail_template,
    }

    return destroy.definition.url
            .replace('{mail_template}', parsedArgs.mail_template.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Settings\MailTemplateController::destroy
* @see app/Http/Controllers/Admin/Settings/MailTemplateController.php:119
* @route '/admin123/mail-templates/{mail_template}'
*/
destroy.delete = (args: { mail_template: string | number } | [mail_template: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const MailTemplateController = { destroyMany, toggleStatus, index, create, store, show, edit, update, destroy }

export default MailTemplateController