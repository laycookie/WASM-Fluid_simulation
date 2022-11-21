const path = require("path");

module.exports = {
  entry: "./src/index.tsx",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /(node_modules)/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }],
      },
      {
        test: /\.json$/,
        use: "json-loader",
      },
      {
        test: /\.(ts)x?$|\.d\.ts$/,
        exclude: /node_modules|\.d\.ts$/,
        use: {
          loader: "ts-loader",
        },
      },
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    compress: true,
    port: 8080,
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    modules: ["src", "node_modules"],
    fallback: {
      fs: false,
      tls: false,
      net: false,
      path: require.resolve("path-browserify"),
      zlib: false,
      http: false,
      https: false,
      stream: false,
      crypto: false,
    },
  },
  experiments: {
    topLevelAwait: true,
  },
  output: {
    path: path.resolve(__dirname, "dist/build"),
    filename: "bundle.js",
  },
};
