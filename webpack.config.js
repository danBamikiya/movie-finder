const path = require('path');
const Dotenv = require('dotenv-webpack');

const NODE_ENV = process.env.NODE_ENV;
if (!NODE_ENV) {
	console.error('NODE_ENV not set');
	process.exit(1);
}

const __DEV__ = NODE_ENV === 'development';

module.exports = {
	mode: __DEV__ ? 'development' : 'production',
	entry: ['./src/js/index.js', './src/js/useHoverCard.js'], //entrypoint of js files
	output: {
		path: path.resolve(__dirname, 'public'),
		filename: 'js/main.js' // where js files would be bundled to
	},
	watch: true,
	module: {
		rules: [
			{
				test: /\.js$/, //using regex to tell babel exactly what files to transcompile
				exclude: /node_modules/, // files to be ignored
				use: {
					loader: 'babel-loader' // loader to apply to the matched files
				}
			}
		]
	},
	devtool: __DEV__ ? 'eval-cheap-module-source-map' : 'source-map', // enable source maps
	resolve: {
		fallback: {
			fs: false
		}
	},
	plugins: [new Dotenv()]
};
