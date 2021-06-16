'use strict';

const fs = require('fs');
const path = require('path');

const getPublicUrlOrPath = require('./dev-utils/getPublicUrlOrPath');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const publicUrlOrPath = getPublicUrlOrPath(
	process.env.NODE_ENV === 'development',
	require(resolveApp('package.json')).homepage,
	process.env.PUBLIC_URL
);

const buildPath = 'build';

const moduleFileExtensions = ['ts', 'js', 'json'];

// we're in '.' (the root dir of the app)
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
	publicUrlOrPath
};

module.exports.moduleFileExtensions = moduleFileExtensions;
