const path = require("path");

const webpack = require("webpack");

const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

const IS_DEVELOPMENT = process.env.NODE_ENV === "dev";

const dirApp = path.join(__dirname, "app");
const dirimages = path.join(__dirname, "images");
const dirShared = path.join(__dirname, "shared");
const dirStyles = path.join(__dirname, "styles");
const dirVideos = path.join(__dirname, "videos");
const dirNode = "node_modules";

module.exports = {
  entry: [path.join(dirApp, "index.js"), path.join(dirStyles, "index.scss")],
  resolve: {
    alias: {
      styles: dirStyles,
      images: dirimages,
    },
    modules: [dirApp, dirimages, dirShared, dirStyles, dirVideos, dirNode],
  },
  plugins: [
    new webpack.DefinePlugin({
      IS_DEVELOPMENT,
    }),
    // ProvidePlugin used so that you have global imports
    new webpack.ProvidePlugin({}),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "./shared",
          to: "",
        },
      ],
    }),
    new MiniCSSExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
    new ImageMinimizerPlugin({
      minimizerOptions: {
        test: /\.(jpe?g|png|gif|svg)$/i,
        // Lossless optimization with custom option
        // Feel free to experiment with options for better result for you
        plugins: [
          ["gifsicle", { interlaced: true }],
          ["jpegtran", { progressive: true }],
          ["optipng", { optimizationLevel: 5 }],
        //   [
        //     "svgo",
        //     {
        //       plugins: [
        //         {
        //           removeViewBox: false,
        //         },
        //       ],
        //     },
        //   ],
        ],
      },
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCSSExtractPlugin.loader,
            options: {
              publicPath: "",
            },
          },
          {
            loader: "css-loader",
          },
          {
            loader: "postcss-loader",
          },
          {
            loader: "sass-loader",
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|woff2?|fnt|webp)$/i,
        loader: "file-loader",
        options: {
          name(file) {
            return "[hash].[ext]";
          },
        },
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        type: 'asset',
      },
      {
        test: /\.(glsl|frag|vert)$/i,
        loader: "raw-loader",
        exclude: /node_modules/
      },
      {
        test: /\.(glsl|frag|vert)$/i,
        loader: "gslsify-loader",
        exclude: /node_modules/
      },
    ],
  },
};
