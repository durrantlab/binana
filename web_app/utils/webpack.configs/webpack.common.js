const path = require('path');
var DuplicatePackageCheckerPlugin = require("duplicate-package-checker-webpack-plugin");
const { DefinePlugin } = require('webpack');
// const webpack = require('webpack');

module.exports = {
    plugins: [
        new DuplicatePackageCheckerPlugin(),
        // new webpack.ExtendedAPIPlugin()  // Gives hash as __webpack_hash__
        new DefinePlugin({
            __BUILD_TIME__: '"Built on ' + new Date().toLocaleString() + '"'
        })
    ],
    module: {
        rules: [
            { test: /\.tsx?$/, loader: "ts-loader" },
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            jszip: path.join(__dirname, 'node_modules/jszip/lib/index.js') // src
        }
        // alias: {
        //     'vue$': 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js' for webpack 1
        // }
    },
    output: {
        path: path.resolve(__dirname, '../../dist')
    }
};
