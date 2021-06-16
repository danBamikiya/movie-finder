'use strict';

const { URL } = require('url');

/**
 * Returns a URL or a path with slash at the end
 * In production can be URL, abolute path, relative path
 * In development always will be an absolute path
 * In development can use `path` module functions for operations
 */
function getPublicUrlOrPath(isEnvDevelopment, homepage, envPublicUrl) {
	const stubDomain = 'https://google.com';

	if (envPublicUrl) {
		// ensure last slash exists
		envPublicUrl = envPublicUrl.endsWith('/')
			? envPublicUrl
			: envPublicUrl + '/';

		// validate if `envPublicUrl` is a URL or path like
		// `stubDomain` is ignored if `envPublicUrl` contains a domain
		const validPublicUrl = new URL(envPublicUrl, stubDomain);

		return isEnvDevelopment
			? envPublicUrl.startsWith('.')
				? '/'
				: validPublicUrl.pathname
			: envPublicUrl;
	}

	if (homepage) {
		// strip last slash if exists
		homepage = homepage.endsWith('/') ? homepage : homepage + '/';

		// validate if `homepage` is a URL or path like and use just pathname
		const validHomepagePathname = new URL(homepage, stubDomain).pathname;
		return isEnvDevelopment
			? homepage.startsWith('.')
				? '/'
				: validHomepagePathname
			: homepage.startsWith('.')
			? homepage
			: validHomepagePathname;
	}

	return '/';
}

module.exports = getPublicUrlOrPath;
