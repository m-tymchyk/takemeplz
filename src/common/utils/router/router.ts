import React from 'react';
import { matchPath } from 'react-router';
import { History, LocationDescriptor } from 'history';
import get from 'lodash/get';

import { WithTranslationsProps, ITranslationsAdapter } from 'slim-i18n';
import {
    getSecondaryLocales,
    getDefaultLocale,
    locales,
    DEFAULT_LOCALE,
    getLocales,
    Locale,
} from 'common/utils/locale';
import { PageSeoConfig, SitemapOption } from 'common/utils/seo';
import { SitemapLink, SEO_HOST } from '../seo/utils';

export type RouteLoadFn = () => Promise<React.ComponentType>;
export type RouteHeadRenderFn = (props: WithTranslationsProps) => React.ReactNode;

export type CommonRouteDescriptor = {
    id: string;
    path: string;
    exact?: boolean;
    rawPath?: string;

    head?: RouteHeadRenderFn;
    getSeoConfig?: (i18n: ITranslationsAdapter) => PageSeoConfig;
    getSitemapOption?: () => SitemapOption;
};

export type RouteDescriptor = CommonRouteDescriptor & {
    load: RouteLoadFn;
    disableAnimation?: boolean;
    tryFreeLink?: string;
};

export type RedirectDescriptor = {
    from: string;
    to: string;
    statusCode?: number;
    exact?: boolean;
};

export type MatchProps = {
    locale?: string;
};

const allLocalesList = Object.keys(locales);
const secondaryLocalesList = Object.keys(getSecondaryLocales());
export const localePathRule = secondaryLocalesList.length > 0 ? `/:locale(${secondaryLocalesList.join('|')})?` : '';
export const allLocalesRegExp = new RegExp(`^/(${allLocalesList.join('|')})`);
export const defaultLocaleRegExp = new RegExp(`^/(${DEFAULT_LOCALE})`);

export function makeRoutePath(path: string): string {
    return `${localePathRule}${path}`;
}

export function makeRouteLoadFunction(id: string): RouteLoadFn {
    return async () => {
        const componentPromise = import(/* webpackChunkName: '[request]' */ `common/routes/${id}`);

        return (await componentPromise).default;
    };
}

export function getActiveRoute(activePath: string, routes: RouteDescriptor[]): RouteDescriptor | null {
    return findRoute(activePath, routes);
}

export function getActiveRedirect(activePath: string, redirects: RedirectDescriptor[]): RedirectDescriptor | null {
    const redirect = redirects.find((redirectDescriptor: RedirectDescriptor) => {
        const { from, exact } = redirectDescriptor;
        const match = matchPath(activePath, {
            exact,
            path: from,
        });

        return match !== null;
    });

    return redirect || null;
}

function findRoute(activePath: string, routes: RouteDescriptor[]): RouteDescriptor | null {
    const route = routes.find((routeDescriptor: RouteDescriptor) => {
        const { path, exact } = routeDescriptor;
        const match = matchPath(activePath, { path, exact });

        return match !== null;
    });

    return route || null;
}

export function getRouteLocale(path: string): string {
    const match = matchPath<MatchProps>(path, {
        path: localePathRule,
    });

    const { code: defaultLanguageCode } = getDefaultLocale();
    if (match === null) {
        return defaultLanguageCode;
    }

    return match.params.locale || defaultLanguageCode;
}

// tslint:disable-next-line:no-any
export function pushHistoryState(history: History, path: string, state: any): void {
    const currentHistoryState = get(history, 'location.state', {});

    history.push(path, {
        ...currentHistoryState,
        ...state,
    });
}

export function isDefaultLocalePath(locationDescriptor: LocationDescriptor): boolean {
    if (typeof locationDescriptor === 'string') {
        return isDefaultLocalePathString(locationDescriptor);
    }

    const { pathname } = locationDescriptor;
    if (pathname === undefined) {
        return false;
    }

    return isDefaultLocalePathString(pathname);
}

function isDefaultLocalePathString(path: string): boolean {
    return path.match(defaultLocaleRegExp) !== null;
}

export function isAnyLocalePath(locationDescriptor: LocationDescriptor): boolean {
    if (typeof locationDescriptor === 'string') {
        return isAnyLocalePathString(locationDescriptor);
    }

    const { pathname } = locationDescriptor;
    if (pathname === undefined) {
        return false;
    }

    return isAnyLocalePathString(pathname);
}

function isAnyLocalePathString(path: string): boolean {
    return path.match(allLocalesRegExp) !== null;
}

export function getSitemapLinks(path: string): SitemapLink[] {
    return getLocales().map((locale: Locale) => {
        const url = `${SEO_HOST}/${locale.code}${path}`;
        return {
            lang: locale.shortCode,
            url,
        };
    });
}
