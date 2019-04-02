export const SEO_HOST = 'https://takemeplz.com';

export type PageSeoConfig = {
    title: string;
    description: string;
    pageName?: string;
    robotsRule?: string;
    canonicalLink?: string;
    path?: string;
};

type Changefreq = 'daily' | 'weekly' | 'monthly';

export type SitemapOption = {
    path: string;
    priority?: number;
    changefreq?: Changefreq;
    lastmod?: string;
};

export type SitemapLink = {
    lang: string;
    url: string;
};

export type SitemapUrlOption = SitemapOption & {
    url: string;
    priority: number;
    changefreq: Changefreq;
    lastmod: string;
    links: SitemapLink[];
};
