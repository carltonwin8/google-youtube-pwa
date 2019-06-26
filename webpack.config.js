const path = require("path");

module.exports = {
  mode: "development",
  entry: { index: "./src/client/js/index.js", sw: "./src/client/js/sw.js" },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].js"
  }
};
