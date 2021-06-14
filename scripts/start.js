'use strict';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them.
process.on('unhandledRejection', err => {
	throw err;
});

const spawn = require('cross-spawn');

const COMMANDS = ['webpack', 'serve', '--inline'];

console.log(
	'\x1B[36mStarting the development server...\x1B[39m\n\x1B[36m\x1B[39m'
);

const result = spawn.sync('npx', COMMANDS, { stdio: 'inherit' });

if (result.signal) {
	if (result.signal === 'SIGKILL') {
		console.log(
			'The \x1B[1mstart\x1B[22m failed because the process exited too early. ' +
				'This probably means the system ran out of memory or someone called ' +
				'`kill -9` on the process.'
		);
	} else if (result.signal === 'SIGTERM') {
		console.log(
			'The \x1B[1mstart\x1B[22m failed because the process exited too early. ' +
				'Someone might have called `kill` or `killall`, or the system could ' +
				'be shutting down.'
		);
	}
	process.exit(1);
}
process.exit(result.status);
