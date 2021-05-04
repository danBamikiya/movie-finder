const fs = require('fs');
const { join } = require('path');

const dirPath = join(__dirname, '../dist/js');

if (!fs.existsSync(dirPath)) {
	fs.mkdirSync(dirPath, { recursive: true });
	fs.writeFileSync(join(dirPath, 'main.js'), '');
}
