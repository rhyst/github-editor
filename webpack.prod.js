var webpack = require("webpack");
var CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

let config = common.appConfig;
config['DEVELOPMENT'] = JSON.stringify(false)
console.log("Configuration:")
for (key in config) {
    console.log("\t" + key + ": " + JSON.parse(config[key]))
}

module.exports = merge.smart(common.webpackConfig, {
    entry: [
        "./src/index.tsx"
    ],
    devtool: "source-map",    
    plugins: [
        new CopyWebpackPlugin([{ from: "src/static"}, {from: "index.html"}]),
        new CleanWebpackPlugin(["dist"]),
        new UglifyJsPlugin(),
        new webpack.DefinePlugin(config)
    ]    
});