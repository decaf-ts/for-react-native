const path = require("path");
const fs = require("fs");

function resolveDecafAliases() {
	const basePath = path.join(__dirname, "node_modules", "@decaf-ts");

	return Object.fromEntries(
		fs
			.readdirSync(basePath)
			.filter((name) => fs.existsSync(path.join(basePath, name, "lib", "esm")))
			.map((name) => [`@decaf-ts/${name}`, path.join(basePath, name, "lib", "esm")])
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
						...resolveDecafAliases(),
					},
				},
			],
			"@babel/plugin-transform-class-static-block",
		],
	};
};
