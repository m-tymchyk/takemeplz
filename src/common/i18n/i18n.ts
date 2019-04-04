import i18next from 'i18next';
import { ITranslationsAdapter } from 'slim-i18n';
import { locales, getLocale } from 'common/utils/locale';

i18next.init({
    lng: 'ru-ru',
    lowerCaseLng: true,
    keySeparator: false,
    nsSeparator: false,
    defaultNS: 'translation',
    resources: {
        'ru-ru': {
            translation: require(`resources/locales/ru-ru.json`),
        },
    },
});

export default class I18N {
    public get currentLanguage(): string {
        return i18next.language;
    }

    public get currentLanguageCode(): string {
        return getLocale(this.currentLanguage).shortCode;
    }

    public isAvailableLanguage(language: string): boolean {
        return locales[language] !== undefined;
    }

    public getI18n = (): ITranslationsAdapter => {
        return {
            language: this.currentLanguage,
            languageCode: this.currentLanguageCode,
            gettext: (key: string) => i18next.t(key),
            ngettext: (singularKey: string, _pluralKey: string, count: number) => i18next.t(singularKey, { count }),
            pgettext: (context: string, key: string) => i18next.t(key, { context }),
            npgettext: (context: string, key: string, _pluralKey: string, count: number) =>
                i18next.t(key, { context, count }),
        };
    };

    public onLanguageChanged(handler: () => void): void {
        i18next.on('languageChanged', handler);
    }

    public async setLanguage(language: string): Promise<void> {
        if (this.currentLanguage === language) {
            return;
        }

        // Load resource
        const {
            default: resource,
        } = await import(/* webpackChunkName: '[request]' */ `resources/locales/${language}.json`);

        // Workaround for localise.biz exported json
        if ('' in resource) {
            delete resource[''];
        }

        i18next.addResources(language, 'translation', resource);

        await i18next.changeLanguage(language);
    }
}

export type TranslateFunction = (i18n: ITranslationsAdapter) => string;

export function __(text: string): TranslateFunction {
    return (i18n: ITranslationsAdapter) => i18n.gettext(text);
}
