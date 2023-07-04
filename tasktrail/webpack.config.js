// webpack.config.js
const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");

module.exports = (env, argv) => {
	// this is the entry file for webpack
	const { mode } = argv;
	const isProduction = mode === "production";
	return {
		entry: "./src/main.js",
		mode: isProduction ? "production" : "development",

		// compiled/built output file
		output: {
			path: path.resolve(__dirname, "public/js/"),
			filename: "index.js",
			// this must be same as Express static use.
			// Check ./app.js
			publicPath: "/js/"
		},
		plugins: [
			// make sure to include the plugin!
			new VueLoaderPlugin()
		],
		module: {
			rules: [
				{
					test: /\.vue$/,
					loader: "vue-loader"
				},
				{
					test: /\.pug$/,
					loader: "pug-plain-loader"
				},
				{
					test: /\.s[ac]ss$/i,
					use: ["style-loader", "css-loader", "sass-loader"]
				},
				{
					test: /\.css$/,
					use: ["style-loader", "css-loader"],
					include: [
						// incluye la carpeta de Alertify.js en el proceso de construcción
						/node_modules\/alertifyjs/
					]
				}
			]
		},
		devServer: {
			static: "./",
			compress: true,
			port: 8080,
			proxy: {
				// redirect request to port 3000
				// which is node.js server's port. Check ./bin/www file
				"/": "http://localhost:3000"
			}
		},
		resolve: {
			alias: {
				// we have to use Vue Es Modules compatible build
				vue$: "vue/dist/vue.esm.js"
			}
		},
		performance: {
			hints: false,
			maxEntrypointSize: 512000,
			maxAssetSize: 512000
		},
		experiments: {
			topLevelAwait: true
		}
	};
};
