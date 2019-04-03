import React from 'react';
import { ITranslationsAdapter } from 'slim-i18n';
import { SEO_HOST } from './utils';

// tslint:disable:no-http-string
export default (props: OpenGraphProps): React.ReactNode => {
    const { description, i18n } = props;

    const data = {
        '@context': 'http://schema.org',
        '@type': 'Organization',
        name: 'Takemeplz',
        description: description,
        image: `${SEO_HOST}/img/${i18n.language}/open-graph.png`,
        logo: `${SEO_HOST}/img/logo.png`,
        url: SEO_HOST,
        sameAs: [
            'https://www.facebook.com/takemeplz',
        ],
        email: 'support@takemetrip.com',
    };

    return <script type="application/ld+json">{JSON.stringify(data)}</script>;
};

type OpenGraphProps = {
    description: string;
    i18n: ITranslationsAdapter;
};
