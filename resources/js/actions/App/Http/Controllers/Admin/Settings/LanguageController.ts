import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\Settings\LanguageController::destroyMany
* @see app/Http/Controllers/Admin/Settings/LanguageController.php:129
* @route '/admin123/languages/destroy-many'
*/
export const destroyMany = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyMany.url(options),
    method: 'delete',
})

destroyMany.definition = {
    methods: ["delete"],
    url: '/admin123/languages/destroy-many',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\Settings\LanguageController::destroyMany
* @see app/Http/Controllers/Admin/Settings/LanguageController.php:129
* @route '/admin123/languages/destroy-many'
*/
destroyMany.url = (options?: RouteQueryOptions) => {
    return destroyMany.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Settings\LanguageController::destroyMany
* @see app/Http/Controllers/Admin/Settings/LanguageController.php:129
* @route '/admin123/languages/destroy-many'
*/
destroyMany.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyMany.url(options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\Settings\LanguageController::toggleStatus
* @see app/Http/Controllers/Admin/Settings/LanguageController.php:0
* @route '/admin123/languages/{id}/toggle-status'
*/
export const toggleStatus = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleStatus.url(args, options),
    method: 'put',
})

toggleStatus.definition = {
    methods: ["put"],
    url: '/admin123/languages/{id}/toggle-status',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\Settings\LanguageController::toggleStatus
* @see app/Http/Controllers/Admin/Settings/LanguageController.php:0
* @route '/admin123/languages/{id}/toggle-status'
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
* @see \App\Http\Controllers\Admin\Settings\LanguageController::toggleStatus
* @see app/Http/Controllers/Admin/Settings/LanguageController.php:0
* @route '/admin123/languages/{id}/toggle-status'
*/
toggleStatus.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleStatus.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\Settings\LanguageController::index
* @see app/Http/Controllers/Admin/Settings/LanguageController.php:37
* @route '/admin123/languages'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin123/languages',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Settings\LanguageController::index
* @see app/Http/Controllers/Admin/Settings/LanguageController.php:37
* @route '/admin123/languages'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Settings\LanguageController::index
* @see app/Http/Controllers/Admin/Settings/LanguageController.php:37
* @route '/admin123/languages'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Settings\LanguageController::index
* @see app/Http/Controllers/Admin/Settings/LanguageController.php:37
* @route '/admin123/languages'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Settings\LanguageController::create
* @see app/Http/Controllers/Admin/Settings/LanguageController.php:50
* @route '/admin123/languages/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin123/languages/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Settings\LanguageController::create
* @see app/Http/Controllers/Admin/Settings/LanguageController.php:50
* @route '/admin123/languages/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Settings\LanguageController::create
* @see app/Http/Controllers/Admin/Settings/LanguageController.php:50
* @route '/admin123/languages/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Settings\LanguageController::create
* @see app/Http/Controllers/Admin/Settings/LanguageController.php:50
* @route '/admin123/languages/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Settings\LanguageController::store
* @see app/Http/Controllers/Admin/Settings/LanguageController.php:58
* @route '/admin123/languages'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin123/languages',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Settings\LanguageController::store
* @see app/Http/Controllers/Admin/Settings/LanguageController.php:58
* @route '/admin123/languages'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Settings\LanguageController::store
* @see app/Http/Controllers/Admin/Settings/LanguageController.php:58
* @route '/admin123/languages'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\Settings\LanguageController::show
* @see app/Http/Controllers/Admin/Settings/LanguageController.php:78
* @route '/admin123/languages/{language}'
*/
export const show = (args: { language: string | number } | [language: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin123/languages/{language}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Settings\LanguageController::show
* @see app/Http/Controllers/Admin/Settings/LanguageController.php:78
* @route '/admin123/languages/{language}'
*/
show.url = (args: { language: string | number } | [language: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { language: args }
    }

    if (Array.isArray(args)) {
        args = {
            language: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        language: args.language,
    }

    return show.definition.url
            .replace('{language}', parsedArgs.language.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Settings\LanguageController::show
* @see app/Http/Controllers/Admin/Settings/LanguageController.php:78
* @route '/admin123/languages/{language}'
*/
show.get = (args: { language: string | number } | [language: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Settings\LanguageController::show
* @see app/Http/Controllers/Admin/Settings/LanguageController.php:78
* @route '/admin123/languages/{language}'
*/
show.head = (args: { language: string | number } | [language: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Settings\LanguageController::edit
* @see app/Http/Controllers/Admin/Settings/LanguageController.php:86
* @route '/admin123/languages/{language}/edit'
*/
export const edit = (args: { language: number | { id: number } } | [language: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin123/languages/{language}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Settings\LanguageController::edit
* @see app/Http/Controllers/Admin/Settings/LanguageController.php:86
* @route '/admin123/languages/{language}/edit'
*/
edit.url = (args: { language: number | { id: number } } | [language: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { language: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { language: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            language: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        language: typeof args.language === 'object'
        ? args.language.id
        : args.language,
    }

    return edit.definition.url
            .replace('{language}', parsedArgs.language.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Settings\LanguageController::edit
* @see app/Http/Controllers/Admin/Settings/LanguageController.php:86
* @route '/admin123/languages/{language}/edit'
*/
edit.get = (args: { language: number | { id: number } } | [language: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Settings\LanguageController::edit
* @see app/Http/Controllers/Admin/Settings/LanguageController.php:86
* @route '/admin123/languages/{language}/edit'
*/
edit.head = (args: { language: number | { id: number } } | [language: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Settings\LanguageController::update
* @see app/Http/Controllers/Admin/Settings/LanguageController.php:96
* @route '/admin123/languages/{language}'
*/
export const update = (args: { language: string | number } | [language: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin123/languages/{language}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\Settings\LanguageController::update
* @see app/Http/Controllers/Admin/Settings/LanguageController.php:96
* @route '/admin123/languages/{language}'
*/
update.url = (args: { language: string | number } | [language: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { language: args }
    }

    if (Array.isArray(args)) {
        args = {
            language: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        language: args.language,
    }

    return update.definition.url
            .replace('{language}', parsedArgs.language.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Settings\LanguageController::update
* @see app/Http/Controllers/Admin/Settings/LanguageController.php:96
* @route '/admin123/languages/{language}'
*/
update.put = (args: { language: string | number } | [language: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\Settings\LanguageController::update
* @see app/Http/Controllers/Admin/Settings/LanguageController.php:96
* @route '/admin123/languages/{language}'
*/
update.patch = (args: { language: string | number } | [language: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\Settings\LanguageController::destroy
* @see app/Http/Controllers/Admin/Settings/LanguageController.php:117
* @route '/admin123/languages/{language}'
*/
export const destroy = (args: { language: string | number } | [language: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin123/languages/{language}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\Settings\LanguageController::destroy
* @see app/Http/Controllers/Admin/Settings/LanguageController.php:117
* @route '/admin123/languages/{language}'
*/
destroy.url = (args: { language: string | number } | [language: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { language: args }
    }

    if (Array.isArray(args)) {
        args = {
            language: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        language: args.language,
    }

    return destroy.definition.url
            .replace('{language}', parsedArgs.language.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Settings\LanguageController::destroy
* @see app/Http/Controllers/Admin/Settings/LanguageController.php:117
* @route '/admin123/languages/{language}'
*/
destroy.delete = (args: { language: string | number } | [language: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const LanguageController = { destroyMany, toggleStatus, index, create, store, show, edit, update, destroy }

export default LanguageController