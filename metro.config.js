// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push("glb", "gltf");
// Retirer svg des assetExts pour permettre le transformer
config.resolver.assetExts = config.resolver.assetExts.filter((ext) => ext !== "svg");

// Ajouter svg aux sourceExts
config.resolver.sourceExts.push("svg");

// Configurer le transformer pour les SVG
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
};

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.includes("zustand")) {
    const result = require.resolve(moduleName);
    return context.resolveRequest(context, result, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;