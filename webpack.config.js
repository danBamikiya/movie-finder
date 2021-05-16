const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
	mode: 'development',
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
	devtool: process.env.NODE_ENV === 'development', // enable source maps in only in development
	resolve: {
		fallback: {
			fs: false
		}
	},
	plugins: [new Dotenv()]
};
