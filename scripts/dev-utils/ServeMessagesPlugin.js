'use strict';

const clearConsole = require('./clearConsole');
const chalk = require('chalk');

class ServeMessagesPlugin {
	constructor({ appName, isInteractive, localUrl }) {
		this.isInteractive = isInteractive;
		this.appName = appName;
		this.localUrl = localUrl;
		this.isFirstCompile = true;
	}

	apply(compiler) {
		// "invalid" event fires when you have changed a file, and webpack is
		// recompiling a bundle.
		compiler.hooks.invalid.tap('invalid', () => {
			if (this.isInteractive) {
				clearConsole();
			}
		});

		// "done" event fires when webpack has finished recompiling the bundle.
		compiler.hooks.done.tap('done', async stats => {
			if (this.isInteractive) {
				clearConsole();
			}

			const statsData = stats.toJson({
				all: false,
				warnings: true,
				errors: true
			});
			const isSuccessful =
				!statsData.errors.length && !statsData.warnings.length;

			const isWarning = statsData.warnings.length;

			if (isSuccessful) {
				console.log(chalk.green('Compiled successfully!'));
				console.log();

				if (this.isInteractive && this.isFirstCompile) {
					this.printInstructions(this.appName, this.localUrl);
				}

				this.isFirstCompile = false;
			} else if (isWarning) {
				console.log(chalk.yellow('Compiled with warnings.\n'));
				console.log();
			} else {
				console.log(chalk.red('Failed to compile.\n'));
				console.log();
			}
		});
	}

	printInstructions(appName, localUrl) {
		console.log();
		console.log(`You can now view ${chalk.bold(appName)} in the browser.`);
		console.log();

		console.log(`   ${chalk.bold('Local:')}       ${localUrl}`);

		console.log();
		console.log('Note that the development build is not optimized.');
		console.log(
			`To create a production build, use ` + `${chalk.cyan('npm run build')}.`
		);
		console.log();
	}
}

module.exports = ServeMessagesPlugin;
