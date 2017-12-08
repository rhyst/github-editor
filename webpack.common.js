var webpack = require("webpack");
var CopyWebpackPlugin = require('copy-webpack-plugin');

try {
    var rawConfig = require('./config.js');
} catch (e) {
    console.log('Missing config. Ensure you have a config file at the project root.');
    process.exit()
}
let config = {};
for (key in rawConfig) {
    config[key] = JSON.stringify(rawConfig[key])
}

module.exports = {
    webpackConfig: {
        output: {
            filename: "bundle.js",
            path: __dirname + "/dist",
            publicPath: "/dist"
        },
        resolve: {
            // Add '.ts' and '.tsx' as resolvable extensions.
            extensions: [".ts", ".tsx", ".js", ".json"]
        },

        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: "babel-loader",
                            options: {
                                presets: ["es2015", "react"]
                            }
                        },
                        {
                            loader: "ts-loader"
                        }
                    ]
                }
            ]
        }
    },
    appConfig: config
};
