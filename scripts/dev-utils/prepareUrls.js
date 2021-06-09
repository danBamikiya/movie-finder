'use strict';

const url = require('url');
const chalk = require('chalk');

function prepareUrls(protocol, host, port, pathname = '/') {
	const formatUrl = hostname =>
		url.format({
			protocol,
			hostname,
			port: port,
			pathname
		});

	const prettyPrintUrl = hostname =>
		url.format({
			protocol,
			hostname,
			port: chalk.bold(port),
			pathname
		});

	let prettyHost;
	if (host === '0.0.0.0') {
		prettyHost = 'localhost';
	} else {
		prettyHost = host;
	}

	const localUrlForTerminal = prettyPrintUrl(prettyHost);
	const localUrlForBrowser = formatUrl(prettyHost);
	return {
		localUrlForTerminal,
		localUrlForBrowser
	};
}

module.exports = prepareUrls;
