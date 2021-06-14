'use strict';

const fs = require('fs');
const path = require('path');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const publicUrlOrPath = '/';

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
