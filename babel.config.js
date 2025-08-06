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
			.filter((name) => fs.existsSync(path.join(basePath, name, "lib", "esm")))
			.map((name) => [`${alias}/${name}`, path.join(basePath, name, "lib", "esm")])
	);
}

module.exports = function (api) {
	api.cache(true);

	return {
		presets: [["babel-preset-expo", { jsxImportSource: "nativewind" }], "nativewind/babel"],
		plugins: [
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
			"@babel/plugin-transform-class-static-block",
		],
	};
};
