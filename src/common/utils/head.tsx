import React from 'react';
import { isFragment } from 'react-is';
import Helmet from 'react-helmet';
import { compose } from 'recompose';
import { WithTranslationsProps, withTranslations, ITranslationsAdapter } from 'slim-i18n';
import { RouteHeadRenderFn } from './router/router';
import { OpenGraph, PageSeoConfig, getStructuredData, Breadcrumbs, getHrefLangUrls } from './seo';

const defaultSeoConfig: PageSeoConfig = {
    title: 'Takemeplz',
    description: 'О да!',
};

const Head = ({ i18n, children: render, getSeoConfig }: HeadProps) => {
    const children: React.ReactElement<object>[] = [];
    const seoConfig: PageSeoConfig
        = Object.assign({}, defaultSeoConfig, getSeoConfig ? getSeoConfig(i18n) : {});

    if (render !== undefined) {
        // @ts-ignore
        React.Children.forEach(render({ i18n }), (child: React.ReactChild) => {
            if (typeof child === 'string' || typeof child === 'number') {
                return;
            }

            if (isFragment(child)) {
                children.push(...child.props.children);
                return;
            }

            children.push(child);
        });
    }

    return (
        <>
            <Helmet encodeSpecialCharacters={false} title={seoConfig.title}>
                <html lang={i18n.languageCode} />
                <meta name="Content-Language" content={i18n.languageCode} />
                <meta name="description" content={seoConfig.description} />
                {seoConfig.path !== undefined ? getHrefLangUrls(seoConfig.path) : null}
                {seoConfig.canonicalLink !== undefined ? <link rel="canonical" href={seoConfig.canonicalLink} /> : null}
                {seoConfig.robotsRule && <meta name="robots" content={seoConfig.robotsRule} />}

                {React.Children.map(children, (child: React.ReactChild, key: number) => {
                    if (typeof child === 'string' || typeof child === 'number') {
                        return;
                    }

                    return React.cloneElement(child, { key });
                })}

                {getStructuredData({
                    i18n: i18n,
                    description: seoConfig.description,
                })}
            </Helmet>

            <OpenGraph title={seoConfig.title} description={seoConfig.description} />
            <Breadcrumbs secondItem={seoConfig.pageName} />
        </>
    );
};


export type HeadOuterProps = {
    children?: RouteHeadRenderFn;
    getSeoConfig?: (i18n: ITranslationsAdapter) => PageSeoConfig;
};
export type HeadProps = WithTranslationsProps & HeadOuterProps;

export default compose<HeadProps, HeadOuterProps>(withTranslations)(Head);
