const path = require("path");

module.exports = {
  entry: "./src/index.tsx",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
        exclude: /node_modules/,
        use: ["file-loader?name=[name].[ext]"], // ?name=[name].[ext] is only necessary to preserve the original file name
      },
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
        test: /\.(js)x?$/,
        exclude: /node_modules|\.d\.ts$/,
        use: "babel-loader",
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.(ts)x?$|\.d\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
          options: {
            compilerOptions: {
              noEmit: false,
            },
          },
        },
      },
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules|\.d\.ts$/,
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
