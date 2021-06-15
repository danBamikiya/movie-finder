'use strict';

const spawn = require('cross-spawn');

const clearConsole = require('./dev-utils/clearConsole');
const openBrowser = require('./dev-utils/openBrowser');

const url = 'http://localhost:8080';

const COMMANDS = [
	'http-server',
	'./build',
	'-c-1',
	'--cors',
	'--proxy',
	`${url}?`
];

clearConsole();

console.log(
	'\x1B[36mServing the production build locally...\x1B[39m\n\x1B[36m\x1B[39m'
);
console.log();

spawn.sync(COMMANDS[0], COMMANDS.slice(1), { stdio: 'inherit' });
openBrowser(url);
