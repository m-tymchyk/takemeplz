const os = require('os');
const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const Loaders = require('./webpack/loaders');

const isDev = process.env.NODE_ENV !== 'production';

module.exports = {
    mode: isDev ? 'development' : 'production',
    devtool: false, // 'sourcemap',
    context: path.resolve(process.cwd(), 'src'),

    resolve: {
        extensions: ['.ts', '.js', '.json'],
        modules: [path.resolve(process.cwd(), 'src'), 'node_modules'],
        alias: {
            resources: path.resolve(process.cwd(), 'resources'),
            config: path.resolve(process.cwd(), 'config'),
        },
    },

    entry: {
        main: 'api-server/api-server',
    },

    target: 'node',

    externals: [
        nodeExternals({
            whitelist: ['slim-i18n', 'idle-callback'],
        }),
    ],

    output: {
        path: path.resolve(process.cwd(), 'dest/api'),
        filename: 'api-server.js',
        publicPath: '/',
    },

    module: {
        rules: [Loaders.getTSLoader()],
    },

    plugins: [
        new webpack.DefinePlugin({
            __isBrowser__: 'false',
        }),
    ],

    optimization: {
        splitChunks: false,
        minimize: false,
    },

    stats: {
        children: false,
        chunks: false,
    },
};
