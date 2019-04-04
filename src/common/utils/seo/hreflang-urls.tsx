import React from 'react';
import { SEO_HOST } from './utils';

export default (path: string) => [
    <link key="ru-ru" rel="alternate" href={`${SEO_HOST}/${path}`} hrefLang="ru-ru" />,
    <link key="uk-ua" rel="alternate" href={`${SEO_HOST}/uk-ua${path}`} hrefLang="uk-ua" />,
];
