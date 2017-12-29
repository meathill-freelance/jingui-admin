/**
 * Created by Meathill on 2017/5/16.
 */

const path = require('path');
const {find} = require('lodash');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const config = require('./webpack.config');

config.devtool = false;
config.watch = false;
config.resolve.alias.config = path.resolve(__dirname, './config/prod.env.js');
config.plugins = config.plugins.concat([
  new UglifyJSPlugin({
    exclude: /^vendor.js$/
  }),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production')
    }
  }),
  new HtmlWebpackPlugin({
    template: 'index.template.html',
  }),
  new ExtractTextPlugin({
    filename: '[name].css',
    allChunks: true,
  }),
]);
config.module.loaders = config.module.loaders.slice(0, 1).concat([
  {
    test: /\.styl$/,
    use: ExtractTextPlugin.extract({
      use: 'css-loader!stylus-loader',
      fallback: 'style-loader',
    }),
  },
  {
    test: /\.vue$/,
    loader: 'vue-loader',
    options: {
      preserveWhitespace: false,
      loaders: {
        stylus: ExtractTextPlugin.extract({
          use: 'css-loader!stylus-loader',
          fallback: 'vue-style-loader',
        }),
      },
    },
  },
]);

module.exports = config;