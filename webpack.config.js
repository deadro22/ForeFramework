const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ForeErrorsPlugin = require("./fore/foreErrors");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "./main.bundle.js",
    path: path.join(__dirname, "dist"),
  },

  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
          },
          output: {
            comments: false,
          },
        },
      }),
    ],
  },
  devServer: {
    clientLogLevel: "none",
    stats: "none",
    compress: true,
    noInfo: true,
    open: false,
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.fore|\.js$/,
        use: [{ loader: path.resolve("./fore/loader.js") }],
      },
      {
        exclude: /node_modules/,
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        exclude: /node_modules/,
        test: /\.cssp$/,
        use: path.resolve("./cloader.js"),
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./template/index.html",
      filename: "./index.html",
    }),

    new ForeErrorsPlugin(),
  ],
};
