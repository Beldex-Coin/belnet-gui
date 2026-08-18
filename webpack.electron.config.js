/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

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
      moduleIds: 'deterministic'
    }
  };
};
