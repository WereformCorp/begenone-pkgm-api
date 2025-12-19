module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    [
      "transform-rename-import",
      {
        original: "\\.jsx$",
        replacement: ".js",
      },
    ],
  ],
};
