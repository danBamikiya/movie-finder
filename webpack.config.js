const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const NODE_ENV = process.env.NODE_ENV;
if (!NODE_ENV) {
	console.error('NODE_ENV not set');
	process.exit(1);
}

const __DEV__ = NODE_ENV === 'development';
const outputDir = 'public';

module.exports = {
	mode: __DEV__ ? 'development' : 'production',
	entry: ['./src/ts/index.ts', './src/ts/ui/HoverCard/index.ts'], //entrypoint of ts files
	output: {
		path: path.resolve(__dirname, outputDir),
		filename: 'js/[name].[contenthash].bundle.js', // where js files will be bundled to
		clean: true // clean up the js folder before each build
	},
	devServer: {
		contentBase: path.join(__dirname, outputDir),
		port: 8080
	},
	watch: true,
	module: {
		rules: [
			{
				test: /\.ts$/, //using regex to tell babel exactly what files to transcompile
				exclude: /node_modules/, // files to be ignored
				use: [
					{
						loader: 'babel-loader'
					},
					{
						loader: 'ts-loader'
					}
				]
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			}
		]
	},
	devtool: __DEV__ ? 'eval-cheap-module-source-map' : 'source-map', // enable source maps
	resolve: {
		extensions: ['.ts', '.js'],
		fallback: {
			fs: false
		}
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: 'index.[contenthash].html',
			template: './src/index.html'
		}),
		new Dotenv()
	],
	optimization: {
		moduleIds: 'deterministic', // Optimize bundles during subsequent builds
		runtimeChunk: 'single', // Prevent module duplication when code splitting
		splitChunks: {
			cacheGroups: {
				vendor: {
					// Split dependencies into its own chunk file for better caching
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					chunks: 'all'
				}
			}
		}
	}
};
