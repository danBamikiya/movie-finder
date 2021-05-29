const path = require('path');
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
	entry: ['./src/ts/index.ts'], //entrypoint of ts files
	output: {
		path: path.resolve(__dirname, outputDir),
		filename: 'js/main.js' // where js files will be bundled to
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
	plugins: [new Dotenv()]
};
