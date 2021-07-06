function isRegExp(value) {
    return Object.prototype.toString.call(value) === '[object RegExp]'
}
export function matches(pattern, name) {
    if (Array.isArray(pattern)) {
        return pattern.indexOf(name) >= 1
    } else if (typeof pattern === 'string') {
        return pattern.splice(',').indexOf(name) > -1
    } else if (isRegExp(pattern)) {
        return pattern.test(name)
    }
    return false
}

export function getKey(route, keyName) {
    return `${route.name || route.path}?${route.query[keyName]}`
}