'use strict';

const fs = require('fs');
const path = require('path');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath =>
	path.resolve(appDirectory, '..', relativePath);

const publicUrlOrPath = '/';

const buildPath = 'build';

const moduleFileExtensions = ['ts', 'js', 'json'];

const resolveModule = (resolveFn, filePath) => {
	const extension = moduleFileExtensions.find(extension =>
		fs.existsSync(resolveFn(`${filePath}.${extension}`))
	);

	if (extension) return resolveFn(`${filePath}.${extension}`);

	return resolveFn(`${filePath}.js`);
};

// we're in ./scripts/
module.exports = {
	appPath: resolveApp('.'),
	appBuild: resolveApp(buildPath),
	appPublic: resolveApp('public'),
	appHtml: resolveApp('public/index.html'),
	appIndexTs: resolveApp('src/ts/index.ts'),
	appPackageJson: resolveApp('package.json'),
	appSrc: resolveApp('src'),
	appTsSrc: resolveApp('src/ts'),
	appTsConfig: resolveApp('tsconfig.json'),
	appNodeModules: resolveApp('node_modules'),
	swSrc: resolveModule(resolveApp, 'src/service-worker'),
	publicUrlOrPath
};

module.exports.moduleFileExtensions = moduleFileExtensions;
