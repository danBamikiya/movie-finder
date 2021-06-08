'use strict';

function clearConsole() {
	process.stdout.write(
		process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H'
	); // Clear the console and buffer terminal and set the cursor to home position
	// https://en.wikipedia.org/wiki/ANSI_escape_code
}

module.exports = clearConsole;
