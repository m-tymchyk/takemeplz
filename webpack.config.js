const apiConfig = require('./webpack.config.api');
const clientConfig = require('./webpack.config.client');
const serverConfig = require('./webpack.config.server');

module.exports = [apiConfig, clientConfig, serverConfig];
