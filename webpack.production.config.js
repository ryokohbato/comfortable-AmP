const path = require("path");
const config = require("./webpack.config");

module.exports = {
  ...config,

  mode: "production",
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "production/")
  },
  devtool: false
};
