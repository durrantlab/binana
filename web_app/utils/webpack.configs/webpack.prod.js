const webpack = require('webpack');
const merge = require('webpack-merge');
// const webworker = require('./webpack.webworker.js');
const notWebworker = require('./webpack.not-webworker.js');
const path = require('path');
const ClosurePlugin = require('closure-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

let forProd = {
    mode: 'production',
    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin()
    ],
    optimization: {
        // sideEffects: false,
        // concatenateModules: false,
        minimizer: [
            new OptimizeCSSAssetsPlugin({}),
            new ClosurePlugin({
                mode: 'STANDARD', // 'AGGRESSIVE_BUNDLE', // 'STANDARD',
                platform: "java"
            }, {
                // debug: true,
                // renaming: false
                externs: [
                    path.resolve(__dirname, '../closure/custom_extern.js')
                ],
                compilation_level: 'ADVANCED',
                // formatting: 'PRETTY_PRINT',
            })
        ],
        splitChunks: {
            chunks: 'async',
            minSize: 30000,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            automaticNameMaxLength: 30,
            name: true,
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                },
                styles: {
                    // Only 1 CSS file.
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true,
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        },
        // splitChunks: { // Does NOT break webworker. Interesting...
        //     cacheGroups: {
        //         styles: {
        //             // Only 1 CSS file.
        //             name: 'styles',
        //             test: /\.css$/,
        //             chunks: 'all',
        //             enforce: true,
        //         },
        //         commons: {
        //             minChunks: 2
        //         }
        //     },
        // },
    }
}

// let webworkerFinal = merge(webworker, forProd);
let nonWebworkerFinal = merge(notWebworker, forProd);

// module.exports = [webworkerFinal, nonWebworkerFinal];
module.exports = [nonWebworkerFinal];
