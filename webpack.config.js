var path = require('path');

module.exports = {
  entry: "./misc/demo/app/main.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "demo.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015']
        }
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass']
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.scss']
  }
}
