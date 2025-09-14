// babel.config.js (CommonJS)
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "expo-router/babel", // expo-router 사용 시 권장
      [
        "module-resolver",
        {
          root: ["."],            // 루트 기준
          alias: { "@": "." },    // "@/..." 별칭
          extensions: [".ts", ".tsx", ".js", ".jsx", ".json", ".svg"],
        },
      ],
      // "react-native-reanimated/plugin", // Reanimated 쓰면 맨 마지막에 추가
    ],
  };
};
