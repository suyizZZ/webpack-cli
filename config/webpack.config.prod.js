const webpack = require("webpack");

const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");

const { CleanWebpackPlugin } = require("clean-webpack-plugin"); // 清理输出文件夹

const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const resolve = dir => path.join(__dirname, "../", dir);

module.exports = {
  mode: "production", // 生产模式
  devtool: "source-map", // source-map
  entry: {
    app: resolve("src/index.js")
  },
  output: {
    // filename: "[name].[hash:8].js",
    filename: "./static/[name].[hash:8].js",
    // chunkFilename: "[name].[chunkhash:8].chunk.js",
    chunkFilename: "./static/[name].[chunkhash:8].chunk.js",
    path: resolve("dist")
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: require.resolve("babel-loader")
        // options: {
        //   presets: ["@babel/preset-env", "@babel/preset-react"], // jsx转为js函数
        //   plugins: [["@babel/plugin-proposal-decorators", { legacy: true }]]
        // }
      },

      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader", "postcss-loader"],
        exclude: /node_modules/,
        include: resolve("src")
      },

      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[path][name].[ext]"
            }
          }
        ]
      },

      {
        test: /\.svg/,
        use: [
          {
            loader: "svg-inline-loader"
          }
        ]
      },

      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader'
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: resolve("dist/index.html"),
      template: resolve("static/index.html")
    }),

    new CleanWebpackPlugin(), // 清空输出文件夹

    new BundleAnalyzerPlugin(),

    new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /\.(scss|css)$/g,
    })
    // new CommonsChunkPlugin({
    //   name: ["common","jquery","vue","load"],
    //   minChunks:2
    // })
  ],

  //splitChunks 默认配置
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      chunks: "all",
      maxInitialRequests: Infinity,
      minSize: 0,
      // name: false,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all"
        },
        styles: {
          name: 'styles',
          test: /\.(scss|css)$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  }
};
