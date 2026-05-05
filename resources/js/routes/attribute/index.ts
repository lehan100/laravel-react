import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ImageUploadController::upload
* @see app/Http/Controllers/ImageUploadController.php:122
* @route '/attribute-upload'
*/
export const upload = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: upload.url(options),
    method: 'post',
})

upload.definition = {
    methods: ["post"],
    url: '/attribute-upload',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ImageUploadController::upload
* @see app/Http/Controllers/ImageUploadController.php:122
* @route '/attribute-upload'
*/
upload.url = (options?: RouteQueryOptions) => {
    return upload.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ImageUploadController::upload
* @see app/Http/Controllers/ImageUploadController.php:122
* @route '/attribute-upload'
*/
upload.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: upload.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\AttributeController::quickSave
* @see app/Http/Controllers/Admin/Catalog/AttributeController.php:125
* @route '/admin123/attribute/quick-save'
*/
export const quickSave = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: quickSave.url(options),
    method: 'post',
})

quickSave.definition = {
    methods: ["post"],
    url: '/admin123/attribute/quick-save',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Catalog\AttributeController::quickSave
* @see app/Http/Controllers/Admin/Catalog/AttributeController.php:125
* @route '/admin123/attribute/quick-save'
*/
quickSave.url = (options?: RouteQueryOptions) => {
    return quickSave.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Catalog\AttributeController::quickSave
* @see app/Http/Controllers/Admin/Catalog/AttributeController.php:125
* @route '/admin123/attribute/quick-save'
*/
quickSave.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: quickSave.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\AttributeController::destroyMany
* @see app/Http/Controllers/Admin/Catalog/AttributeController.php:157
* @route '/admin123/attribute/destroy-many'
*/
export const destroyMany = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyMany.url(options),
    method: 'delete',
})

destroyMany.definition = {
    methods: ["delete"],
    url: '/admin123/attribute/destroy-many',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\Catalog\AttributeController::destroyMany
* @see app/Http/Controllers/Admin/Catalog/AttributeController.php:157
* @route '/admin123/attribute/destroy-many'
*/
destroyMany.url = (options?: RouteQueryOptions) => {
    return destroyMany.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Catalog\AttributeController::destroyMany
* @see app/Http/Controllers/Admin/Catalog/AttributeController.php:157
* @route '/admin123/attribute/destroy-many'
*/
destroyMany.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyMany.url(options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\AttributeController::toggleStatus
* @see app/Http/Controllers/Admin/Catalog/AttributeController.php:0
* @route '/admin123/attribute/{id}/toggle-status'
*/
export const toggleStatus = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleStatus.url(args, options),
    method: 'put',
})

toggleStatus.definition = {
    methods: ["put"],
    url: '/admin123/attribute/{id}/toggle-status',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\Catalog\AttributeController::toggleStatus
* @see app/Http/Controllers/Admin/Catalog/AttributeController.php:0
* @route '/admin123/attribute/{id}/toggle-status'
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
* @see \App\Http\Controllers\Admin\Catalog\AttributeController::toggleStatus
* @see app/Http/Controllers/Admin/Catalog/AttributeController.php:0
* @route '/admin123/attribute/{id}/toggle-status'
*/
toggleStatus.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleStatus.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\AttributeController::index
* @see app/Http/Controllers/Admin/Catalog/AttributeController.php:44
* @route '/admin123/attribute'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin123/attribute',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Catalog\AttributeController::index
* @see app/Http/Controllers/Admin/Catalog/AttributeController.php:44
* @route '/admin123/attribute'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Catalog\AttributeController::index
* @see app/Http/Controllers/Admin/Catalog/AttributeController.php:44
* @route '/admin123/attribute'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\AttributeController::index
* @see app/Http/Controllers/Admin/Catalog/AttributeController.php:44
* @route '/admin123/attribute'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\AttributeController::create
* @see app/Http/Controllers/Admin/Catalog/AttributeController.php:55
* @route '/admin123/attribute/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin123/attribute/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Catalog\AttributeController::create
* @see app/Http/Controllers/Admin/Catalog/AttributeController.php:55
* @route '/admin123/attribute/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Catalog\AttributeController::create
* @see app/Http/Controllers/Admin/Catalog/AttributeController.php:55
* @route '/admin123/attribute/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\AttributeController::create
* @see app/Http/Controllers/Admin/Catalog/AttributeController.php:55
* @route '/admin123/attribute/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\AttributeController::store
* @see app/Http/Controllers/Admin/Catalog/AttributeController.php:62
* @route '/admin123/attribute'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin123/attribute',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Catalog\AttributeController::store
* @see app/Http/Controllers/Admin/Catalog/AttributeController.php:62
* @route '/admin123/attribute'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Catalog\AttributeController::store
* @see app/Http/Controllers/Admin/Catalog/AttributeController.php:62
* @route '/admin123/attribute'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\AttributeController::show
* @see app/Http/Controllers/Admin/Catalog/AttributeController.php:0
* @route '/admin123/attribute/{attribute}'
*/
export const show = (args: { attribute: string | number } | [attribute: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin123/attribute/{attribute}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Catalog\AttributeController::show
* @see app/Http/Controllers/Admin/Catalog/AttributeController.php:0
* @route '/admin123/attribute/{attribute}'
*/
show.url = (args: { attribute: string | number } | [attribute: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { attribute: args }
    }

    if (Array.isArray(args)) {
        args = {
            attribute: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        attribute: args.attribute,
    }

    return show.definition.url
            .replace('{attribute}', parsedArgs.attribute.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Catalog\AttributeController::show
* @see app/Http/Controllers/Admin/Catalog/AttributeController.php:0
* @route '/admin123/attribute/{attribute}'
*/
show.get = (args: { attribute: string | number } | [attribute: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\AttributeController::show
* @see app/Http/Controllers/Admin/Catalog/AttributeController.php:0
* @route '/admin123/attribute/{attribute}'
*/
show.head = (args: { attribute: string | number } | [attribute: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\AttributeController::edit
* @see app/Http/Controllers/Admin/Catalog/AttributeController.php:88
* @route '/admin123/attribute/{attribute}/edit'
*/
export const edit = (args: { attribute: string | number } | [attribute: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin123/attribute/{attribute}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Catalog\AttributeController::edit
* @see app/Http/Controllers/Admin/Catalog/AttributeController.php:88
* @route '/admin123/attribute/{attribute}/edit'
*/
edit.url = (args: { attribute: string | number } | [attribute: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { attribute: args }
    }

    if (Array.isArray(args)) {
        args = {
            attribute: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        attribute: args.attribute,
    }

    return edit.definition.url
            .replace('{attribute}', parsedArgs.attribute.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Catalog\AttributeController::edit
* @see app/Http/Controllers/Admin/Catalog/AttributeController.php:88
* @route '/admin123/attribute/{attribute}/edit'
*/
edit.get = (args: { attribute: string | number } | [attribute: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\AttributeController::edit
* @see app/Http/Controllers/Admin/Catalog/AttributeController.php:88
* @route '/admin123/attribute/{attribute}/edit'
*/
edit.head = (args: { attribute: string | number } | [attribute: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\AttributeController::update
* @see app/Http/Controllers/Admin/Catalog/AttributeController.php:98
* @route '/admin123/attribute/{attribute}'
*/
export const update = (args: { attribute: string | number } | [attribute: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin123/attribute/{attribute}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\Catalog\AttributeController::update
* @see app/Http/Controllers/Admin/Catalog/AttributeController.php:98
* @route '/admin123/attribute/{attribute}'
*/
update.url = (args: { attribute: string | number } | [attribute: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { attribute: args }
    }

    if (Array.isArray(args)) {
        args = {
            attribute: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        attribute: args.attribute,
    }

    return update.definition.url
            .replace('{attribute}', parsedArgs.attribute.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Catalog\AttributeController::update
* @see app/Http/Controllers/Admin/Catalog/AttributeController.php:98
* @route '/admin123/attribute/{attribute}'
*/
update.put = (args: { attribute: string | number } | [attribute: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\AttributeController::update
* @see app/Http/Controllers/Admin/Catalog/AttributeController.php:98
* @route '/admin123/attribute/{attribute}'
*/
update.patch = (args: { attribute: string | number } | [attribute: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\Catalog\AttributeController::destroy
* @see app/Http/Controllers/Admin/Catalog/AttributeController.php:145
* @route '/admin123/attribute/{attribute}'
*/
export const destroy = (args: { attribute: string | number } | [attribute: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin123/attribute/{attribute}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\Catalog\AttributeController::destroy
* @see app/Http/Controllers/Admin/Catalog/AttributeController.php:145
* @route '/admin123/attribute/{attribute}'
*/
destroy.url = (args: { attribute: string | number } | [attribute: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { attribute: args }
    }

    if (Array.isArray(args)) {
        args = {
            attribute: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        attribute: args.attribute,
    }

    return destroy.definition.url
            .replace('{attribute}', parsedArgs.attribute.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Catalog\AttributeController::destroy
* @see app/Http/Controllers/Admin/Catalog/AttributeController.php:145
* @route '/admin123/attribute/{attribute}'
*/
destroy.delete = (args: { attribute: string | number } | [attribute: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const attribute = {
    upload: Object.assign(upload, upload),
    quickSave: Object.assign(quickSave, quickSave),
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

export default attribute