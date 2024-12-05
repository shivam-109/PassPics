const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { InjectManifest } = require("workbox-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.[contenthash].js",
    publicPath: "/",
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|ico)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|mp4|webm)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      favicon: "./public/images/pass-pix.svg",
    }),
    new InjectManifest({
      swSrc: "./src/serviceWorker.js",
      swDest: "service-worker.js",
    }),
  ],
  devServer: {
    historyApiFallback: true,
    open: true,
    hot: true,
    port: 3000,
    proxy: {
      "/ws": {
        target: "http://localhost:5000",
        ws: true,
      },
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
};
