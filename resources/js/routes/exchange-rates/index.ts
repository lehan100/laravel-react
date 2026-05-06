import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults, validateParameters } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ExchangeRateController::show
* @see app/Http/Controllers/Admin/ExchangeRateController.php:16
* @route '/admin123/exchange-rates/{currency?}'
*/
export const show = (args?: { currency?: string | number } | [currency: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin123/exchange-rates/{currency?}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ExchangeRateController::show
* @see app/Http/Controllers/Admin/ExchangeRateController.php:16
* @route '/admin123/exchange-rates/{currency?}'
*/
show.url = (args?: { currency?: string | number } | [currency: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { currency: args }
    }

    if (Array.isArray(args)) {
        args = {
            currency: args[0],
        }
    }

    args = applyUrlDefaults(args)

    validateParameters(args, [
        "currency",
    ])

    const parsedArgs = {
        currency: args?.currency,
    }

    return show.definition.url
            .replace('{currency?}', parsedArgs.currency?.toString() ?? '')
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ExchangeRateController::show
* @see app/Http/Controllers/Admin/ExchangeRateController.php:16
* @route '/admin123/exchange-rates/{currency?}'
*/
show.get = (args?: { currency?: string | number } | [currency: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ExchangeRateController::show
* @see app/Http/Controllers/Admin/ExchangeRateController.php:16
* @route '/admin123/exchange-rates/{currency?}'
*/
show.head = (args?: { currency?: string | number } | [currency: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

const exchangeRates = {
    show: Object.assign(show, show),
}

export default exchangeRates