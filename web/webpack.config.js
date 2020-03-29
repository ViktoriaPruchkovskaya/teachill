/* eslint-disable @typescript-eslint/no-var-requires */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './src/index.tsx',
  mode: 'development',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js',
  },

  resolve: {
    extensions: ['.json', '.ts', '.tsx', '.js'],
  },

  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'static/index.html',
    }),
  ],

  devServer: {
    contentBase: path.join(__dirname, './dist'),
    compress: true,
    port: 3001,
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
};
