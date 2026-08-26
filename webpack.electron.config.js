/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
    // no source maps in production: smaller artifacts, faster startup
    devtool: isProduction ? false : 'source-map',
    entry: './main.ts',
    target: 'electron-main',
    module: {
      rules: [
        {
          test: /\.(js|ts|tsx)$/,
          use: [{ loader: 'babel-loader' }],
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    },
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: '[name].js'
    },
    optimization: {
      minimize: isProduction,
      // Keep function and class names through minification. ipcNode dispatches
      // by name, and the bundled native/schema libraries (zeromq, electron-store
      // -> conf -> ajv) are name-sensitive too.
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            keep_fnames: true,
            keep_classnames: true
          }
        })
      ],
      moduleIds: 'deterministic'
    }
  };
};
