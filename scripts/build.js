'use strict';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them.
process.on('unhandledRejection', err => {
	throw err;
});

const fs = require('fs-extra');
const spawn = require('cross-spawn');

const { appBuild, appPublic, appHtml } = require('./paths');

const COMMANDS = ['webpack'];

console.log(
	'\x1B[36mCreating an optimized production build...\x1B[39m\n\x1B[36m\x1B[39m'
);

// Remove all previous build content
fs.emptyDirSync(appBuild);
// Merge with the public folder
copyPublicFolder();

// Start the webpack build
const result = spawn.sync('npx', COMMANDS, { stdio: 'inherit' });

if (result.signal) {
	if (result.signal === 'SIGKILL') {
		console.log(
			'The \x1B[1mbuild\x1B[22m failed because the process exited too early. ' +
				'This probably means the system ran out of memory or someone called ' +
				'`kill -9` on the process.'
		);
	} else if (result.signal === 'SIGTERM') {
		console.log(
			'The \x1B[1mbuild\x1B[22m failed because the process exited too early. ' +
				'Someone might have called `kill` or `killall`, or the system could ' +
				'be shutting down.'
		);
	}
	process.exit(1);
}
process.exit(result.status);

function copyPublicFolder() {
	fs.copySync(appPublic, appBuild, {
		dereference: true,
		filter: file => file !== appHtml
	});
}
