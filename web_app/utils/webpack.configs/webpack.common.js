const path = require('path');
var DuplicatePackageCheckerPlugin = require("duplicate-package-checker-webpack-plugin");
// const webpack = require('webpack');

module.exports = {
    plugins: [
        new DuplicatePackageCheckerPlugin(),
        // new webpack.ExtendedAPIPlugin()  // Gives hash as __webpack_hash__
    ],
    module: {
        rules: [
            { test: /\.tsx?$/, loader: "ts-loader" },
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        // alias: {
        //     'vue$': 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js' for webpack 1
        // }
    },
    output: {
        path: path.resolve(__dirname, '../../dist')
    }
};
