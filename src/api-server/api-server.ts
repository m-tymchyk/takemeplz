import express from 'express';
import cookieParser from 'cookie-parser';
import config from 'backend-utils/config';
import logger from './utils/logger';
import buildRouter from './router';

const expressApp = express();

expressApp.set('port', config.get('apiApp.port') || 5006);
expressApp.set('hostname', config.get('apiApp.host') || 'localhost');

expressApp.use(cookieParser());
expressApp.use('/', buildRouter());

expressApp.listen(expressApp.get('port'), (error?: Error) => {
    if (error) {
        logger.error({ msg: 'API Server init error', error: error.toString() });
        return process.exit(1);
    } else {
        logger.info(`API App is running at http://${expressApp.get('hostname')}:${expressApp.get('port')}`);
    }
});
