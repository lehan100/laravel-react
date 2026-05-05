import { queryParams, type RouteDefinition, type RouteQueryOptions } from '../../../../wayfinder'

export const storeAttribute = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
  url: storeAttribute.url(options),
  method: 'post',
})

storeAttribute.definition = {
  methods: ['post'],
  url: '/attribute-upload',
} satisfies RouteDefinition<['post']>

storeAttribute.url = (options?: RouteQueryOptions) => storeAttribute.definition.url + queryParams(options)

storeAttribute.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
  url: storeAttribute.url(options),
  method: 'post',
})
