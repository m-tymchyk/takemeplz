import { LocationDescriptor } from 'history';
import { isAnyLocalePath } from './router/router';
import { DEFAULT_LOCALE } from './locale';

let baseHost = 'takemetrip.com';
if (__isBrowser__) {
    baseHost = window.location.host;
}

export { baseHost };

export function generateUrl(to: LocationDescriptor, locale: string = DEFAULT_LOCALE): LocationDescriptor {
    if (typeof to !== 'string') {
        return {
            ...to,
            pathname: joinUrlWithLocation(to.pathname, locale),
        };
    }

    return joinUrlWithLocation(to, locale);
}

export function joinUrlWithLocation(to: string = '', locale: string = DEFAULT_LOCALE): string {
    if (locale === DEFAULT_LOCALE) {
        return to;
    }

    if (to === '/') {
        return `/${locale}`;
    }

    return `/${locale}${to}`;
}

export function replaceLocale(path: string, fromLocale?: string, toLocale?: string): string {
    if (toLocale === DEFAULT_LOCALE) {
        toLocale = undefined;
    }

    const pathHasLocaleSegment = isAnyLocalePath(path);
    if (!pathHasLocaleSegment || fromLocale === undefined) {
        return joinUrlWithLocation(path, toLocale);
    }

    const resultPathSegment = makePathSegment(toLocale);
    const searchPathSegment = new RegExp(`^/${fromLocale}`);
    return path.replace(searchPathSegment, resultPathSegment);
}

function makePathSegment(locale?: string): string {
    if (locale === undefined) {
        return '';
    }

    return `/${locale}`;
}

export function normalizeLocalePath(path: string): string {
    // replace '/en-us' path segment to '/'
    return replaceLocale(path, DEFAULT_LOCALE);
}
