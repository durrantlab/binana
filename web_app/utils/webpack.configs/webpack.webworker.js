const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    entry: {
        binanaWebWorker: path.join(__dirname, '../../src/BINANA.worker.ts'),
    },
    output: {
        filename: "[name].js"
    },
});
