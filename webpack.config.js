const path = require('path');
const Dotenv = require('dotenv-webpack');

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
					loader: 'babel-loader' // specify the loader
				}
			}
		]
	},
	plugins: [new Dotenv()]
};
