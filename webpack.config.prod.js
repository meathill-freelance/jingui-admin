/**
 * Created by Meathill on 2017/5/16.
 */

const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const config = require('./webpack.config');
const production = require('./config/prod.env');

const env = process.env.NODE_ENV || 'development';
const isProd = env === 'production';

config.devtool = 'source-map';
config.plugins = config.plugins.concat([
  new HtmlWebpackPlugin({
    template: 'index.template.html',
  }),
  new ExtractTextPlugin({
    filename: '[name].[hash].css',
    allChunks: true,
  }),
]);
config.module.loaders = config.module.loaders.slice(0, 2).concat([
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
  {
    test: /\.css$/,
    use: ExtractTextPlugin.extract({
      use: 'css-loader',
      fallback: 'style-loader',
    }),
  },
]);
config.devServer = {
  contentBase: path.join(__dirname, 'dist'),
  compress: true,
  port: 9002,
};

if (isProd) {
  config.plugins = config.plugins.slice(1).concat([
    new webpack.DefinePlugin(production),
    new UglifyJSPlugin({
      exclude: /^vendor.js$/,
    }),
  ]);
  config.devtool = false;
}

module.exports = config;
