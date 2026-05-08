import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see routes/web.php:72
* @route '/admin123/lang/{locale}'
*/
export const switchMethod = (args: { locale: string | number } | [locale: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: switchMethod.url(args, options),
    method: 'get',
})

switchMethod.definition = {
    methods: ["get","head"],
    url: '/admin123/lang/{locale}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:72
* @route '/admin123/lang/{locale}'
*/
switchMethod.url = (args: { locale: string | number } | [locale: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { locale: args }
    }

    if (Array.isArray(args)) {
        args = {
            locale: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        locale: args.locale,
    }

    return switchMethod.definition.url
            .replace('{locale}', parsedArgs.locale.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see routes/web.php:72
* @route '/admin123/lang/{locale}'
*/
switchMethod.get = (args: { locale: string | number } | [locale: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: switchMethod.url(args, options),
    method: 'get',
})

/**
* @see routes/web.php:72
* @route '/admin123/lang/{locale}'
*/
switchMethod.head = (args: { locale: string | number } | [locale: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: switchMethod.url(args, options),
    method: 'head',
})

const lang = {
    switch: Object.assign(switchMethod, switchMethod),
}

export default lang