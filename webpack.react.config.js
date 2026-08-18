/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      mainFields: ['main', 'module', 'browser']
    },
    entry: './src/app/app.tsx',
    target: 'electron-renderer',
    // no source maps in production: smaller artifacts, faster startup
    devtool: isProduction ? false : 'source-map',
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
        },
        {
          test: /\.(png|jpe?g|gif|woff2|woff|ttf|svg|eot)$/i,
          use: [
            {
              loader: 'file-loader'
            }
          ]
        }
      ]
    },
    devServer: {
      static: { directory: path.join(__dirname, 'dist') },
      historyApiFallback: true,
      compress: false,
      hot: true,
      client: {
        logging: 'info'
      },

      port: 4000
    },
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: 'js/[name].js',
      publicPath: './' //needs to be "./" for releases
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Belnet GUI',
        // provide the #root mount point so the renderer does not have to
        // create it with an extra ReactDom.render pass
        templateContent: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Belnet GUI</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`
      })
    ],
    optimization: {
      minimize: isProduction,
      moduleIds: 'deterministic'
    }
  };
};
