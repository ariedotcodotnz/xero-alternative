const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'src', 'application.js'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: '/',
  },
  mode: process.env.NODE_ENV || 'development',
  devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'eval-cheap-module-source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      components: path.resolve(__dirname, 'src', 'components'),
      // Add project aliases used throughout the codebase
      '@api': path.resolve(__dirname, 'src', 'API'),
      '@hui': path.resolve(__dirname, 'src', 'components'),
      '@hutils': path.resolve(__dirname, 'src', 'es_utilities'),
      assets: path.resolve(__dirname, 'assets'),
      // Victory aliases
      'victory-core': path.resolve(__dirname, 'node_modules', 'victory-core', 'dist', 'victory-core.js'),
      victory: path.resolve(__dirname, 'node_modules', 'victory', 'lib', 'index.js'),
      // Library shims
      'cleave-zen': path.resolve(__dirname, 'node_modules', 'cleave.js'),
    },
    fallback: {
      // Some libraries might try to require Node core modules; explicitly set to false to avoid polyfills
      fs: false,
      path: false,
      crypto: false,
      stream: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: { browsers: 'defaults' } }],
              ['@babel/preset-react', { runtime: 'automatic' }],
              ['@babel/preset-typescript', { allowDeclareFields: true }],
            ],
            plugins: [],
          },
        },
      },
      {
        test: /\.(css|scss)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { sourceMap: true },
          },
          {
            loader: 'sass-loader',
            options: { sourceMap: true },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        type: 'asset',
        parser: { dataUrlCondition: { maxSize: 10 * 1024 } },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public', 'index.html'),
      inject: 'body',
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
  ],
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'public'),
    },
    historyApiFallback: true,
    open: false,
    hot: true,
  },
};
