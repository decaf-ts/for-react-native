const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

config.resolver.alias = {
	"@app": "./src/app",
	"@components": "./src/components",
	"@constants": "./src/constants",
	"@hooks": "./src/hooks",
};

module.exports = withNativeWind(config, { input: "./global.css" });
