/**
 * Created by Meathill on 2017/5/16.
 */

const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const config = require('./webpack.config');

config.devtool = false;
config.watch = false;
config.resolve.alias.config = path.resolve(__dirname, './config/prod.env.js');
config.plugins.push(new UglifyJSPlugin({
  exclude: /^vendor.js$/
}));
config.plugins.push(new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production')
    }
  })
);

module.exports = config;