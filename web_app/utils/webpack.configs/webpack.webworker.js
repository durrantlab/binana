const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    entry: {
        vrmlWebWorker: path.join(__dirname, '../../src/components/Mols/3DMol/VRMLParser.worker.ts'),
    },
    output: {
        filename: "[name].js"
    },
});
