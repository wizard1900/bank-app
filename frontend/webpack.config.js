const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = (env) => ({
  entry: './src/index.js',
  output: {
    filename: 'main[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
  },

  experiments: {
    topLevelAwait: true,
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: 'defaults' }],
            ],
          },
        },
      },
      {
        test: /\.css$/i,
        use: [
          env.prod ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader'],
      },

    ],
  },
  optimization: {
    minimizer: [
      '...',
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.squooshMinify,
          options: {
            // Your options for `squoosh`
          },
        },
      }),
      new CssMinimizerPlugin(),
    ],
  },
  plugins: [new HtmlWebpackPlugin(

  ),
  new MiniCssExtractPlugin(
    { filename: 'css[contenthash].css' },
  ),

  ],
  devServer: {
    port: 4200,
    historyApiFallback: true,
    hot: true,
  },


});

