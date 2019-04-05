import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import config from 'backend-utils/config';
import logger from 'server/utils/logger';
import { applyDevEnv } from 'server/utils/dev-env';
import Middlewares from 'server/middlewares';
import Router from 'server/routes';

const expressStaticGzip = require('express-static-gzip');

const expressApp = express();
expressApp.set('port', config.get('app.port') || 5005);
expressApp.set('hostname', config.get('app.host') || 'localhost');

applyDevEnv(expressApp);

expressApp.use(
    helmet({
        dnsPrefetchControl: false,
        noSniff: false,
        hsts: false,
    }),
);

expressApp.use(cookieParser());

expressApp.use(
    '/',
    expressStaticGzip(path.join(process.cwd(), 'dest/client'), {
        enableBrotli: true,
        orderPreference: ['br'],
        maxAge: '1y',
    }),
);

expressApp.get('/sitemap.xml', Router.dynamicSitemap);

const appHandlers = [
    Middlewares.redirects,
    Middlewares.language,
    // Middlewares.cache,
    Router.reactApplicationRender,
];

if (process.env.NODE_ENV === 'development') {
    appHandlers.unshift(Middlewares.dev);
}
expressApp.get('*', appHandlers);

expressApp.listen(expressApp.get('port'), (error?: Error) => {
    if (error) {
        logger.error({ msg: 'Server init error', error: error.toString() });
        return process.exit(1);
    } else {
        logger.info(`Server is listening on port: ${expressApp.get('port')}`);
        logger.info(
            `App is running at http://${expressApp.get('hostname')}:${expressApp.get('port')}` +
            ` in ${expressApp.get('env')} mode`,
        );
    }
});
