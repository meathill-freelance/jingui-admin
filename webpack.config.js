/**
 * Created by Meathill on 2017/5/16.
 */
/**
 * Created by realm on 2017/2/15.
 */
const path = require('path');
const webpack = require('webpack');
const dev = require('./config/dev.env');

module.exports = {
  entry: {
    'main': './src/main.js'
  },
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.(png|jpg|gif|svg|woff2|eot|woff|ttf|ico)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          esmodule: false,
          name: 'assets/[name].[hash].[ext]'
        },
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.styl$/,
        loader: 'style-loader!css-loader!stylus-loader',
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      'src': path.resolve(__dirname, './src'),
      'styl': path.resolve(__dirname, './styl'),
    },
  },
  plugins: [
    new webpack.DefinePlugin(dev),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: module => {
        return module.context && module.context.indexOf('node_modules') !== -1;
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest'
    }),
  ],
};
