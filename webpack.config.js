const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  entry: { index: "./src/client/js/index.js", sw: "./src/client/js/sw.js" },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].js"
  },
  plugins: [
    new CopyPlugin([
      { from: "./src/client/manifest.json", to: "./manifest.json" },
      { from: "./src/client/icon-512x512.png", to: "./icon-512x512.png" }
    ])
  ]
};
