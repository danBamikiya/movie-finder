'use strict';

const __ENV__ = process.env.NODE_ENV;

if (!__ENV__) {
	console.log(
		`No env set. Expected \x1B[1m'development'\x1B[22m || \x1B[1m'production'\x1B[22m.`
	);
	process.exit(1);
}

const isEnvDevelopment = __ENV__ === 'development';
const isEnvProduction = __ENV__ === 'production';

const path = require('path');
const resolve = require('resolve');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const InlineChunkHtmlPlugin = require('inline-chunk-html-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const ServeMessagesPlugin = require('./scripts/dev-utils/ServeMessagesPlugin');
const WatchMissingNodeModulesPlugin = require('./scripts/dev-utils/WatchMissingNodeModulesPlugin');
const redirectServedPath = require('./scripts/dev-utils/redirectServedPathMiddleware');
const ignoredFiles = require('./scripts/dev-utils/ignoredFiles');

const paths = require('./scripts/paths');
const postcssNormalize = require('postcss-normalize');

// Images that are less than 10,000 bytes
// returns a data URI instead of a path.
// This reduces the number of requests to the server
const imageInlineSizeLimit = 10000;

// style files regexes
const cssRegex = /\.css$/;
const sassRegex = /\.(scss|sass)$/;

const PORT = 8080;
const isInteractive = process.stdout.isTTY;
const appName = require(paths.appPackageJson).name;

// This is the production and development configuration.
// It is focused on fast rebuilds and a minimal bundle.
module.exports = () => {
	// Turn off source maps in production
	// Source maps are resource heavy
	const shouldUseSourceMap = !isEnvProduction;

	// get style loaders
	const getStyleLoaders = (cssOptions, preProcessor) => {
		const loaders = [
			isEnvDevelopment && require.resolve('style-loader'),
			isEnvProduction && {
				loader: MiniCssExtractPlugin.loader
			},
			{
				loader: require.resolve('css-loader'),
				options: cssOptions
			},
			{
				// Options for PostCSS as we reference these options twice
				// Adds vendor prefixing based on your specified browser support in
				// package.json
				loader: require.resolve('postcss-loader'),
				options: {
					postcssOptions: {
						plugins: [
							require('postcss-flexbugs-fixes'),
							[
								require('postcss-preset-env'),
								{
									autoprefixer: {
										flexbox: 'no-2009'
									},
									stage: 3
								}
							],
							// Adds PostCSS Normalize as the reset css with default options
							postcssNormalize()
						]
					},

					sourceMap: isEnvProduction && shouldUseSourceMap
				}
			}
		].filter(Boolean);
		if (preProcessor) {
			loaders.push(
				{
					loader: require.resolve('resolve-url-loader'),
					options: {
						sourceMap: shouldUseSourceMap,
						root: paths.appSrc
					}
				},
				{
					loader: require.resolve(preProcessor),
					options: {
						sourceMap: true
					}
				}
			);
		}
		return loaders;
	};

	return {
		mode: isEnvProduction ? 'production' : isEnvDevelopment && 'development',
		// Stop compilation early in production
		bail: isEnvProduction,
		devtool: isEnvProduction
			? shouldUseSourceMap
				? 'source-map'
				: false
			: isEnvDevelopment && 'eval-cheap-module-source-map',
		// These are the "entry points" to our application.
		// This means they will be the "root" imports that are included in JS bundle.
		entry: isEnvDevelopment
			? [
					// Injecting the dev client to enable hot updates (for CSS changes) and page refreshes (for JS changes)
					require.resolve('webpack-dev-server/client') + '?/',
					require.resolve('webpack/hot/dev-server'),
					// app's code
					paths.appIndexTs
			  ]
			: paths.appIndexTs,
		output: {
			// The build folder
			path: paths.appBuild,
			// Add /* filename */ comments to generated require()s in the output.
			pathinfo: isEnvDevelopment,
			// There will be one main bundle
			// In development, it does not produce real files
			filename: isEnvProduction
				? 'static/js/[name].[contenthash:8].js'
				: isEnvDevelopment && 'static/js/bundle.js',
			chunkFilename: isEnvProduction
				? 'static/js/[name].[contenthash:8].chunk.js'
				: isEnvDevelopment && 'static/js/[name].chunk.js',
			// webpack uses `publicPath` to determine where the app is being served from.
			// It requires a trailing slash, or the file assets will get an incorrect path.
			publicPath: paths.publicUrlOrPath,
			// Point sourcemap entries to original disk location (format as URL on Windows)
			devtoolModuleFilenameTemplate: isEnvProduction
				? info =>
						path
							.relative(paths.appSrc, info.absoluteResourcePath)
							.replace(/\\/g, '/')
				: isEnvDevelopment &&
				  (info => path.resolve(info.absoluteResourcePath).replace(/\\g/, '/'))
		},
		optimization: {
			minimize: isEnvProduction,
			minimizer: [
				// This is only used in production mode
				new TerserPlugin({
					terserOptions: {
						parse: {
							// Parse ecma 8 code.
							ecma: 8
						},
						compress: {
							ecma: 5,
							warnings: false,
							comparisons: false,
							inline: 2
						},
						mangle: {
							safari10: true
						},
						output: {
							ecma: 5,
							comments: false,
							ascii_only: true
						}
					}
				}),
				// This is only used in production mode
				new CssMinimizerPlugin({
					minimizerOptions: {
						preset: ['default', { minifyFontValues: { removeQuotes: false } }],
						processorOptions: {
							parser: 'postcss-safe-parser',
							map: shouldUseSourceMap
								? {
										// `inline: false` forces the sourcemap to be output into a
										// separate file
										inline: false,
										// `annotation: true` appends the sourceMappingURL to the end of
										// the css file, helping the browser find the sourcemap
										annotation: true
								  }
								: false
						}
					}
				})
			],
			moduleIds: 'deterministic',
			// Split dependencies(vendors) and commons
			splitChunks: isEnvProduction && {
				cacheGroups: {
					vendor: {
						test: /[\\/]node_modules[\\/]/,
						name: 'vendors',
						chunks: 'all'
					}
				}
			},
			// Keep the runtime chunk separated to enable long term caching
			runtimeChunk: isEnvProduction && {
				name: entrypoint => `runtime-${entrypoint.name}`
			}
		},
		resolve: {
			extensions: paths.moduleFileExtensions.map(ext => `.${ext}`),
			// The fallback for where webpack should look for modules should be 'node_modules'
			modules: [paths.appNodeModules, paths.appTsSrc]
		},
		module: {
			rules: [
				// Handle node_modules packages that contain sourcemaps
				shouldUseSourceMap && {
					enforce: 'pre',
					exclude: /@babel(?:\/|\\{1,2})runtime/,
					test: /\.(js|mjs|ts|css)$/,
					use: 'source-map-loader'
				},
				{
					// "oneOf" will traverse all following loaders until one will
					// match the requirements. When no loader matches it will fall
					// back to the "file" loader at the end of the loader list.
					oneOf: [
						// "url" loader works like "file" loader except that it embeds assets
						// smaller than specified limit in bytes as data URLs to avoid requests.
						// A missing `test` is equivalent to a match.
						{
							test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
							loader: require.resolve('url-loader'),
							options: {
								limit: imageInlineSizeLimit,
								name: 'static/media/[name].[hash:8].[ext]'
							}
						},
						// ts-loader converts typescript (es6) to javascript (es6)
						// babel-loader converts javascript (es6) to javascript (es5) and add polyfills
						{
							test: /\.ts$/,
							include: paths.appTsSrc,
							use: [
								{
									loader: 'babel-loader',
									options: {
										// It enables caching results in ./node_modules/.cache/babel-loader/
										// directory for faster rebuilds.
										cacheDirectory: true,
										cacheCompression: false,
										compact: isEnvProduction
									}
								},
								{
									loader: 'ts-loader'
								}
							]
						},
						// Process any other JS with Babel using the standard ES features
						{
							test: /\.js$/,
							exclude: /@babel(?:\/|\\{1,2})runtime/,
							use: {
								loader: 'babel-loader',
								options: {
									cacheDirectory: true,
									cacheCompression: false
								}
							}
						},
						// "postcss" loader applies autoprefixer to our CSS.
						// "css" loader resolves paths in CSS and adds assets as dependencies.
						// "style" loader turns CSS into JS modules that inject <style> tags.
						// In production, we use MiniCSSExtractPlugin to extract that CSS
						// to a file, but in development "style" loader enables hot editing
						// of CSS.
						{
							test: cssRegex,
							use: getStyleLoaders({
								importLoaders: 1,
								sourceMap: shouldUseSourceMap,
								modules: {
									compileType: 'icss'
								}
							}),
							sideEffects: true
						},
						// Opt-in support for SASS (using .scss or .sass extensions)
						{
							test: sassRegex,
							use: getStyleLoaders(
								{
									importLoaders: 3,
									sourceMap: shouldUseSourceMap,
									modules: {
										compileType: 'icss'
									}
								},
								'sass-loader'
							),
							sideEffects: true
						},
						// "file" loader makes sure those assets get served by WebpackDevServer.
						// When you `import` an asset, you get its (virtual) filename.
						// In production, they would get copied to the `build` folder.
						// This loader doesn't use a "test" so it will catch all modules
						// that fall through the other loaders.
						{
							loader: require.resolve('file-loader'),
							// Exclude `js` files to keep "css" loader working as it injects
							// its runtime that would otherwise be processed through "file" loader.
							// Also exclude `html` and `json` extensions so they get processed
							// by webpacks internal loaders.
							exclude: [/\.(js|ts)$/, /\.html$/, /\.json$/],
							options: {
								name: 'static/media/[name].[hash:8].[ext]'
							}
						}
					]
				}
			].filter(Boolean)
		},
		plugins: [
			// Generates an `index.html` file with the <script> injected.
			new HtmlWebpackPlugin(
				Object.assign(
					{},
					{
						inject: true,
						template: paths.appHtml
					},
					isEnvProduction && {
						minify: {
							removeComments: true,
							collapseWhitespace: true,
							removeRedundantAttributes: true,
							useShortDoctype: true,
							removeEmptyAttributes: true,
							removeStyleLinkTypeAttributes: true,
							keepClosingSlash: true,
							minifyJS: true,
							minifyCSS: true,
							minifyURLs: true
						}
					}
				)
			),
			// Inlines the webpack runtime script. This script is too small to warrant
			// a network request.
			isEnvProduction &&
				new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]),
			// This is necessary to emit hot updates (CSS and Fast Refresh)
			isEnvDevelopment && new webpack.HotModuleReplacementPlugin(),
			// Prints an error when there's a mistype casing in a path
			isEnvDevelopment && new CaseSensitivePathsPlugin(),
			// Ensures `npm install <library>` forces a project rebuild.
			isEnvDevelopment &&
				new WatchMissingNodeModulesPlugin(paths.appNodeModules),
			// Serve custom messages at different stages of the build
			new ServeMessagesPlugin({
				appName,
				isInteractive,
				localUrl: `http://localhost:${PORT}/`
			}),
			// Extracts CSS into separate files by creating a CSS file per JS file which contains CSS.
			isEnvProduction &&
				new MiniCssExtractPlugin({
					filename: 'static/css/[name].[contenthash:8].css',
					chunkFilename: 'static/css/[name].[contenthash:8].chunk.css'
				}),
			// Generate an asset manifest file
			new WebpackManifestPlugin({
				fileName: 'asset-manifest.json',
				publicPath: paths.publicUrlOrPath,
				generate: (seed, files, entrypoints) => {
					const manifestFiles = files.reduce((manifest, file) => {
						manifest[file.name] = file.path;
						return manifest;
					}, seed);

					const entrypointFiles = entrypoints.main.filter(
						fileName => !fileName.endsWith('.map')
					);

					return {
						files: manifestFiles,
						entrypoints: entrypointFiles
					};
				}
			}),
			// TypeScript type checking
			new ForkTsCheckerWebpackPlugin({
				typescript: {
					enabled: true,
					configFile: paths.appTsConfig,
					typescriptPath: resolve.sync('typescript', {
						basedir: paths.appNodeModules
					})
				},
				async: isEnvDevelopment,
				formatter: 'codeframe',
				logger: {
					infrastructure: 'silent',
					issues: 'console',
					devServer: true
				}
			}),
			// Inject .env variables refrenced in the app's code into the final bundle
			new Dotenv(
				Object.assign(
					{},
					isEnvDevelopment && {
						path: path.resolve(paths.appPath, '.env')
					},
					{
						// Load all system variables as well, useful during CI builds
						systemvars: isEnvProduction,
						// load '.env.example'
						safe:
							isEnvDevelopment && path.resolve(paths.appPath, '.env.example')
					}
				)
			)
		].filter(Boolean),
		devServer: {
			contentBase: paths.appPublic,
			contentBasePublicPath: paths.publicUrlOrPath,
			// Enable gzip compression of generated files.
			compress: true,
			// By default files from `contentBase` will not trigger a page reload.
			watchContentBase: true,
			// Open default browser after server has been started.
			open: true,
			// Enable hot reloading server
			hot: true,
			publicPath: paths.publicUrlOrPath.slice(0, -1),
			watchOptions: {
				ignored: ignoredFiles(paths.appSrc)
			},
			port: PORT,
			overlay: true,
			historyApiFallback: {
				disableDotRule: true,
				index: paths.publicUrlOrPath
			},
			after(app) {
				// Redirect to homepage if url not match
				app.use(redirectServedPath(paths.publicUrlOrPath));
			}
		}
	};
};
