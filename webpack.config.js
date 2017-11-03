const nodeExternals = require('webpack-node-externals');
const path = require('path');
const webpack = require('webpack');
const config = {
  entry: [
    'babel-polyfill', './src/main.js',
  ],
  externals: [nodeExternals()],
  target: 'node',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'main.bundle.js',
    libraryTarget: 'commonjs2',
  },
  plugins: [
    new webpack.BannerPlugin({banner: '#!/usr/bin/env node', raw: true}),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                'env', {
                  'targets': {
                    'node': '4',
                  },
                },
              ],
            ],
          },
        },
      },
    ],
  },
};
if (process.env.WEBPACK_ENV === 'dev') {
  config.devtool = 'eval';
}

module.exports = config;
