const path = require('path');
const Dotenv = require('dotenv-webpack');
const { SourceMapDevToolPlugin } = require('webpack');

module.exports = {
	mode: 'development',
	entry: './src/js/index.js', //location of your js files
	output: {
		path: path.resolve(__dirname, 'dist'),
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
	devtool: false,
	resolve: {
		fallback: {
			fs: false
		}
	},
	plugins: [new Dotenv(), new SourceMapDevToolPlugin({})]
};
