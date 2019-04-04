export type Locale = {
    code: string;
    name: string;
    shortCode: string;
    default?: boolean;
};

export type Locales = Record<string, Locale>;

export const DEFAULT_LOCALE = 'ru-ru';
export const DEFAULT_LOCALE_SHORT_CODE = 'ru';

export const locales: Locales = require('config/locales.json');

export function getDefaultLocale(): Locale {
    return locales[DEFAULT_LOCALE];
}

export function isDefaultLocale(locale: Locale): boolean {
    return locale.code === DEFAULT_LOCALE;
}

export function getLocales(): Locale[] {
    return Object.keys(locales).map(getLocale);
}

export function getLocale(code: string = DEFAULT_LOCALE): Locale {
    const locale = locales[code];
    if (locale === undefined) {
        console.warn(`getLocale:: Invalid language code: "${code}", return default locale`);

        return locales[DEFAULT_LOCALE];
    }

    return locale;
}

export function getLocaleByShotCode(shortCode: string = DEFAULT_LOCALE_SHORT_CODE): Locale {
    const locale = getLocales().find((l: Locale) => l.shortCode === shortCode);
    if (locale === undefined) {
        console.warn(`getLocaleByShotCode:: Invalid language shortCode: "${shortCode}", return default locale`);

        return locales[DEFAULT_LOCALE];
    }

    return locale;
}

export function getSecondaryLocales(): Record<string, Locale> {
    const localeList = { ...locales };
    delete localeList[DEFAULT_LOCALE];

    return localeList;
}
