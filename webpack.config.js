module.exports = {
  module: {
    rules: [
      {
        test: /\.node$/,
        loader: "node-loader",
      },
    ],
  },
  externals: {
    sharp: 'commonjs sharp',
  },
};
