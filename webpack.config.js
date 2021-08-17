const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ESLintPlugin = require('eslint-webpack-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = (env = {}) => {
  const { production = false } = env;

  const getStyleLoaders = () => [production ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader'];

  const getPlugins = () => {
    const plugins = [
      new HtmlWebpackPlugin({
        template: './public/index.html',
      }),
      new ESLintPlugin({
        extensions: ['js', 'jsx', 'tsx', 'ts'],
      }),
    ];
    if (production) {
      plugins.push(
        new MiniCssExtractPlugin({
          filename: 'main-[hash:8].css' }),
      );
    }
    return plugins;
  };

  return {
    mode: production ? 'production' : 'development',
    entry: './src/index.tsx',
    devtool: 'inline-source-map',
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.(ts|js)x?$/i,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react',
                '@babel/preset-typescript',
              ],
            },
          },
        },
        {
          test: /\.css$/i,
          use: getStyleLoaders(),
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.tsx', '...'],
    },
    plugins: getPlugins(),
    optimization: {
      minimizer: [
        new CssMinimizerPlugin(),
      ],
    },
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      port: 9000,
      open: true,
      writeToDisk: true,
      historyApiFallback: true,
    },
  };
};
