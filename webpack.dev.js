var webpack = require("webpack");
var CopyWebpackPlugin = require('copy-webpack-plugin');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

let config = common.appConfig;
config['DEVELOPMENT'] = JSON.stringify(true)
console.log("Configuration:")
for (key in config) {
    console.log("\t" + key + ": " + JSON.parse(config[key]))
}
module.exports = merge.smart(common.webpackConfig, {
    entry: [
        "webpack-dev-server/client?http://localhost:3000",
        "./src/index.tsx"
    ],
    output: {
        publicPath: "/"
    },
    devtool: "source-map",    
    plugins: [
        new CopyWebpackPlugin([{ from: "src/static", to: "" }]),
        new webpack.DefinePlugin(config)
    ],
});