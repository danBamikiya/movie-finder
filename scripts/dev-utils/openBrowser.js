'use strict';

const { execSync } = require('child_process');
const open = require('open');

const OSX_CHROME = 'google chrome';

function startBrowserProcess(browser, url) {
	// If we're on OS X, the user hasn't specifically
	// requested a different browser, we can try opening
	// Chrome with AppleScript. This lets us reuse an
	// existing tab when possible instead of creating a new one.
	const shouldTryOpenChromiumWithAppleScript =
		process.platform === 'darwin' &&
		(typeof browser !== 'string' || browser === OSX_CHROME);

	if (shouldTryOpenChromiumWithAppleScript) {
		// Will use the first open browser found from list
		const supportedChromiumBrowsers = [
			'Google Chrome Canary',
			'Google Chrome',
			'Microsoft Edge',
			'Brave Browser',
			'Vivaldi',
			'Chromium'
		];

		for (const chromiumBrowser of supportedChromiumBrowsers) {
			try {
				// Try to reuse existing tab
				// on OSX Chromium-based browser with AppleScript
				execSync(`ps cax | grep "${chromiumBrowser}"`);
				execSync(
					`osascript openChrome.applescript "${encodeURI(
						url
					)}" "${chromiumBrowser}"`,
					{
						cwd: __dirname,
						stdio: 'ignore'
					}
				);
			} catch (_err) {
				// Ignore errors
			}
		}
	}

	// Another special case: on OS X, check if BROWSER has been set to "open".
	// In this case, instead of passing 'open'(arg) to `open`(package) (which won't work),
	// just ignore it (thus ensuring the intended behavior, i.e. opening the system browser):
	if (process.platform === 'darwin' && browser === 'open') {
		browser = undefined;
	}

	// Fallback to open
	// (It will always open new tab)
	try {
		const options = { app: browser, wait: false, url: true };
		open(url, options).catch(() => {}); // Prevent `unhandledRejection` error.
		return true;
	} catch (err) {
		return false;
	}
}

/**
 * Reads the BROWSER environment variable and decides what to do with it. Returns
 * true if it opened a browser or ran a node.js script, otherwise false.
 */
function openBrowser(url) {
	startBrowserProcess(url);
}

module.exports = openBrowser;
