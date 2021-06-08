'use strict';

const __PROD__ = process.env.NODE_ENV;

if (__PROD__ !== 'production') {
	console.log(
		`The right env is not set.\nExpected 'production' but got ${__PROD__}`
	);
	process.exit(1);
}

// Makes the script crash on unhandled rejections instead of silently
// ignoring them.
process.on('unhandledRejection', err => {
	throw err;
});

const fs = require('fs-extra');
const chalk = require('chalk');
const webpack = require('webpack');

const paths = require('./paths');
const printBuildError = require('./dev-utils/printBuildError');
const configFactory = require('./config/webpack.config.js');

// Generate configuration
const config = configFactory('production');

(function startCompilation() {
	// Remove all previous content
	fs.emptyDirSync(paths.appBuild);
	// Merge with the public folder
	copyPublicFolder();
	// Start the webpack build
	build()
		.then(({ warnings }) => {
			if (warnings.length) {
				console.log(chalk.yellow('Compiled with warnings.\n'));
				console.log(warnings.join('\n\n'));
			} else {
				console.log(chalk.green('Compiled successfully.\n'));
			}

			err => {
				console.log(chalk.red('Failed to compile.\n'));
				printBuildError(err);
				process.exit(1);
			};
		})
		.catch(err => {
			if (err && err.message) {
				console.log(err.message);
			}
			process.exit(1);
		});
})();

// Create the production build.
function build() {
	console.log('Creating an optimized production build...');
	const compiler = webpack(config);
	return new Promise((resolve, reject) => {
		compiler.run((err, stats) => {
			let messages;
			if (err) {
				if (!err.message) {
					return reject(err);
				}

				let errMessage = err.message;

				// Add additional information for postcss errors
				if (Object.prototype.hasOwnProperty.call(err, 'postcssNode')) {
					errMessage +=
						'\nCompileError: Begins at CSS selector ' +
						err['postcssNode'].selector;
				}

				messages = errMessage;
			} else {
				messages = stats.toJson({ all: false, warnings: true, errors: true });
			}

			if (messages.errors.length) {
				// Only keep the first error. Others are often indicative
				// of the same problem
				if (messages.errors.length > 1) {
					messages.errors.length = 1;
				}

				return reject(new Error(messages.errors.join('\n\n')));
			}

			if (
				process.env.CI &&
				(typeof process.env.CI !== 'string' ||
					process.env.CI.toLowerCase() !== 'false') &&
				messages.warnings.length
			) {
				// Ignore sourcemap warnings in CI builds.
				const filteredWarnings = messages.warnings.filter(
					w => !/Failed to parse source map/.test(w)
				);
				if (filteredWarnings.length) {
					console.log(
						chalk.yellow(
							'\nTreating warnings as errors because process.env.CI = true.\n' +
								'Most CI servers set it automatically.\n'
						)
					);
					return reject(new Error(filteredWarnings.join('\n\n')));
				}
			}

			const resolveArgs = {
				warnings: messages.warnings
			};

			return resolve(resolveArgs);
		});
	});
}

function copyPublicFolder() {
	fs.copySync(paths.appPublic, paths.appBuild, {
		dereference: true,
		filter: file => file !== paths.appHtml
	});
}
