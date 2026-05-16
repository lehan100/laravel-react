import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AuthController::login
* @see app/Http/Controllers/Admin/AuthController.php:21
* @route '/admin123/auth/login'
*/
export const login = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})

login.definition = {
    methods: ["get","head"],
    url: '/admin123/auth/login',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AuthController::login
* @see app/Http/Controllers/Admin/AuthController.php:21
* @route '/admin123/auth/login'
*/
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AuthController::login
* @see app/Http/Controllers/Admin/AuthController.php:21
* @route '/admin123/auth/login'
*/
login.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AuthController::login
* @see app/Http/Controllers/Admin/AuthController.php:21
* @route '/admin123/auth/login'
*/
login.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: login.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\AuthController::postLogin
* @see app/Http/Controllers/Admin/AuthController.php:25
* @route '/admin123/auth/post-login'
*/
export const postLogin = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: postLogin.url(options),
    method: 'post',
})

postLogin.definition = {
    methods: ["post"],
    url: '/admin123/auth/post-login',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AuthController::postLogin
* @see app/Http/Controllers/Admin/AuthController.php:25
* @route '/admin123/auth/post-login'
*/
postLogin.url = (options?: RouteQueryOptions) => {
    return postLogin.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AuthController::postLogin
* @see app/Http/Controllers/Admin/AuthController.php:25
* @route '/admin123/auth/post-login'
*/
postLogin.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: postLogin.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\AuthController::logout
* @see app/Http/Controllers/Admin/AuthController.php:34
* @route '/admin123/auth/logout'
*/
export const logout = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: logout.url(options),
    method: 'get',
})

logout.definition = {
    methods: ["get","head"],
    url: '/admin123/auth/logout',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AuthController::logout
* @see app/Http/Controllers/Admin/AuthController.php:34
* @route '/admin123/auth/logout'
*/
logout.url = (options?: RouteQueryOptions) => {
    return logout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AuthController::logout
* @see app/Http/Controllers/Admin/AuthController.php:34
* @route '/admin123/auth/logout'
*/
logout.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: logout.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AuthController::logout
* @see app/Http/Controllers/Admin/AuthController.php:34
* @route '/admin123/auth/logout'
*/
logout.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: logout.url(options),
    method: 'head',
})

const auth = {
    login: Object.assign(login, login),
    postLogin: Object.assign(postLogin, postLogin),
    logout: Object.assign(logout, logout),
}

export default auth