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
          options: {
            compilerOptions: {
              noEmit: false,
            },
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
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
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
};
