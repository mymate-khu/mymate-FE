// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const shimPagerPath = path.resolve(projectRoot, "shims", "react-native-pager-view.web.js");

module.exports = (() => {
  const config = getDefaultConfig(projectRoot);
  const { transformer, resolver } = config;

  // SVG 트랜스포머 (당신 설정 유지)
  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
  };

  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...resolver.sourceExts, "svg"],
    alias: {
      ...(resolver.alias || {}),
      "@": projectRoot, // @ 별칭
    },
    // ✅ 핵심: 웹에서 react-native-pager-view "전체 경로"를 shim으로 보냄
    resolveRequest: (context, moduleName, platform) => {
      if (
        platform === "web" &&
        (moduleName === "react-native-pager-view" ||
          moduleName.startsWith("react-native-pager-view/"))
      ) {
        return { type: "sourceFile", filePath: shimPagerPath };
      }
      if (resolver.resolveRequest) {
        return resolver.resolveRequest(context, moduleName, platform);
      }
      const { resolve } = require("metro-resolver");
      return resolve(context, moduleName, platform);
    },
  };

  // shim 폴더 감시
  config.watchFolders = [
    ...(config.watchFolders || []),
    path.resolve(projectRoot, "shims"),
  ];

  return config;
})();
