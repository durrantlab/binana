const merge = require('webpack-merge');
const webworker = require('./webpack.webworker.js');
const notWebworker = require('./webpack.not-webworker.js');
const webpackDashboard = require('webpack-dashboard/plugin');

let forDev = {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: '../../dist',
        hot: false,  // This breaks webworkers if true.
        liveReload: true,
        writeToDisk: true
    },
    plugins: [
        new webpackDashboard(),
    ]
};

// let webworkerFinal = merge(webworker, forDev);
let nonWebworkerFinal = merge(notWebworker, forDev);

// module.exports = [webworkerFinal, nonWebworkerFinal];
module.exports = [nonWebworkerFinal];
