const path = require("path");
const fs = require("fs");

function resolveAlias(alias) {
	const basePath = path.join(__dirname, "node_modules", alias);
	const isSingleLib =
		fs.existsSync(path.join(basePath, "package.json")) &&
		fs.existsSync(path.join(basePath, "lib", "esm"));

	if (isSingleLib) {
		return {
			[alias]: path.join(basePath, "lib", "esm"),
		};
	}

	return Object.fromEntries(
		fs
			.readdirSync(basePath)
			.filter((name) => fs.existsSync(path.join(basePath, name, "lib")))
			.map((name) => [`${alias}/${name}`, path.join(basePath, name, "lib", "index.cjs")])
	);
}

module.exports = function (api) {
	api.cache(true);

	return {
		presets: [["babel-preset-expo", { jsxImportSource: "nativewind" }], "nativewind/babel"],
		sourceMaps: true,
		plugins: [
			["@babel/plugin-proposal-decorators", { legacy: true }],
			["@babel/plugin-proposal-class-properties", { loose: true }],
			"babel-plugin-transform-typescript-metadata",
			// [
			// 	"@babel/plugin-transform-typescript",
			// 	{ allowDeclareFields: true, disallowAmbiguousJSXLike: true },
			// ],
			"@babel/plugin-transform-class-static-block",
			[
				"module-resolver",
				{
					root: ["./"],
					alias: {
						"@": "./",
						"@app": "./src/app",
						"@components": "./src/components",
						"@constants": "./src/constants",
						"@hooks": "./src/hooks",
						"tailwind.config": "./tailwind.config.js",
						...resolveAlias("typed-object-accumulator"),
						...resolveAlias("@decaf-ts"),
					},
				},
			],
		],
	};
};
