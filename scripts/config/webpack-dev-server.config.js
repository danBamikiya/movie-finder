'use strict';

const paths = require('../paths');
const ignoredFiles = require('../dev-utils/ignoredFiles');
const redirectServedPath = require('../dev-utils/redirectServedPathMiddleware');
const noopServiceWorkerMiddleware = require('../dev-utils/noopServiceWorkerMiddleware');

module.exports = port => {
	return {
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
		port,
		overlay: true,
		historyApiFallback: {
			disableDotRule: true,
			index: paths.publicUrlOrPath
		},
		after(app) {
			// Redirect to homepage if url not match
			app.use(redirectServedPath(paths.publicUrlOrPath));
			// Reset any previously set service worker configuration.
			app.use(noopServiceWorkerMiddleware(paths.publicUrlOrPath));
		}
	};
};
