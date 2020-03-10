const path = require('path');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');

const outputPath = path.resolve(__dirname, './dist');

module.exports = {
  devtool: 'eval-source-map',
  externals: {
    jquery: 'jQuery',
  },
  entry: {
    main: './src/js/main.js',
    top: './src/js/top.js',
    about: './src/js/about.js',
  },
  output: {
    path: outputPath,
    filename: './assets/js/[name].js',
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                autoprefixer({
                  grid: true,
                  browsers: [
                    '> 1%',
                    'last 2 versions',
                    'ie >= 11',
                    'Android >= 4',
                    'iOS >= 10',
                  ],
                }),
              ],
            },
          },
        ],
      },
      {
        test: /\.ejs$/,
        use: [
          'html-loader',
          'ejs-html-loader',
        ],
      },
      {
        test: /\.(jpg|png|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/',
              // eslint-disable-next-line no-shadow
              publicPath: outputPath => `../../images/${outputPath}`,
            },
          },
        ],
      },
    ],
  },
  devServer: {
    contentBase: outputPath,
    watchContentBase: true,
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/index.ejs',
      filename: './index.html',
      chunks: ['main', 'top'],
    }),
    new HtmlWebPackPlugin({
      template: './src/about.ejs',
      filename: './about.html',
      chunks: ['main', 'about'],
    }),
    new MiniCssExtractPlugin({
      filename: './assets/css/[name].css',
    }),
  ],
  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
};
