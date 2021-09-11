const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    "background/background": "./src/background/background.ts",
    "contents/main": "./src/contents/main.ts",
    "popup/popup": "./src/popup/popup.ts",
  },
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "dist/")
  },
  module: {
    rules: [
      {
        test: /\.css|\.scss$/,
        exclude: /node_modules/,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.ts/,
        exclude: /node_modules/,
        use: [
          "ts-loader",
        ],
      }
    ],
  },
  resolve: {
    extensions: [".js", ".ts"],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "src/**/*.(json|html|png|jpg|jpeg|gif|bmp|tif|tiff)",
          to({ context, absoluteFilename }) {
            return absoluteFilename.replace(`${path.resolve(__dirname)}/src/`, "");
          },
        },
      ]
    }),
  ],
  devtool: "cheap-module-source-map"
};
