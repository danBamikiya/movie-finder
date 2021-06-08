'use strict';

const chalk = require('chalk');
const clearConsole = require('./clearConsole');

const isInteractive = process.stdout.isTTY;

function printInstructions(appName, urls) {
	console.log();
	console.log(`You can now view ${chalk.bold(appName)} in the browser.`);
	console.log();

	if (urls.lanUrlForTerminal) {
		console.log(`   ${chalk.bold('Local:')}       ${urls.localUrlForTerminal}`);
		console.log(
			`   ${chalk.bold('On Your Network:')} ${urls.lanUrlForTerminal}`
		);
	} else {
		console.log(` ${urls.localUrlForTerminal}`);
	}

	console.log();
	console.log('Note that the development build is not optimized.');
	console.log(
		`To create a production build, use ` + `${chalk.cyan('npm run build')}.`
	);
	console.log();
}

function createCompiler({ appName, config, urls, webpack }) {
	let compiler;
	try {
		compiler = webpack(config);
	} catch (error) {
		console.log(chalk.red('Failed to compile.'));
		console.log();
		console.log(err.message || err);
		console.log();
		process.exit(1);
	}

	// "invalid" event fires when you have changed a file, and webpack is
	// recompiling a bundle.
	compiler.hooks.invalid.tap('invalid', () => {
		if (isInteractive) {
			clearConsole();
		}
		console.log('Compiling...');
	});

	let isFirstCompile = true;

	// "done" event fires when webpack has finished recompiling the bundle.
	compiler.hooks.done.tap('done', async stats => {
		if (isInteractive) {
			clearConsole();
		}

		const statsData = stats.toJson({
			all: false,
			warnings: true,
			errors: true
		});
		const isSuccessful = !statsData.errors.length && !statsData.warnings.length;

		if (isSuccessful) {
			console.log(chalk.green('Compiled successfully!'));
		}

		if (isSuccessful && (isInteractive || isFirstCompile)) {
			printInstructions(appName, urls);
		}
		isFirstCompile = false;
	});

	return compiler;
}

module.exports = createCompiler;
