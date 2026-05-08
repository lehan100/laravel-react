const ABSOLUTE_MEDIA_URL_PATTERN = /^(https?:)?\/\//i

function normalizeBasePath(basePath: string | undefined): string {
    const normalized = String(basePath || '').trim().replace(/^\/+|\/+$/g, '')

    return normalized
}

function normalizeMediaValue(value: string): string {
    return value.trim().replace(/^\/+/, '')
}

export function resolveMediaUrl(
    value: string | null | undefined,
    basePath: string | { path?: string } | undefined = ''
): string | null {
    if (!value) {
        return null
    }

    const trimmedValue = String(value).trim()

    if (!trimmedValue) {
        return null
    }

    if (ABSOLUTE_MEDIA_URL_PATTERN.test(trimmedValue) || trimmedValue.startsWith('/')) {
        return trimmedValue
    }

    const normalizedBasePath = normalizeBasePath(typeof basePath === 'string' ? basePath : basePath?.path)

    if (!normalizedBasePath) {
        return `/${normalizeMediaValue(trimmedValue)}`
    }

    return `/${normalizedBasePath}/${normalizeMediaValue(trimmedValue)}`
}
