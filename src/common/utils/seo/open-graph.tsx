import React from 'react';
import { compose } from 'recompose';
import Helmet from 'react-helmet';
import { WithTranslationsProps, withTranslations } from 'slim-i18n';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { SEO_HOST } from './utils';

class OpenGraph extends React.PureComponent<OpenGraphProps> {
    public render(): JSX.Element {
        const { title, description, i18n, location } = this.props;

        return (
            <Helmet>
                <meta name="twitter:site" content="@takemeplz" />
                <meta name="twitter:creator" content="@takemeplz" />
                <meta name="twitter:card" content="summary_large_image" />

                <meta property="og:url" content={`${SEO_HOST}${location.pathname}`} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:site_name" content="Take me Plz" />
                <meta property="og:type" content="website" />
                <meta property="og:image" content={`${SEO_HOST}/img/${i18n.language}/open-graph.png`} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:locale" content={i18n.languageCode} />
            </Helmet>
        );
    }
}

type OpenGraphOuterProps = {
    title: string;
    description: string;
};

type OpenGraphProps = OpenGraphOuterProps & WithTranslationsProps & RouteComponentProps<object>;

export default compose<OpenGraphProps, OpenGraphOuterProps>(
    withTranslations,
    withRouter,
)(OpenGraph);
