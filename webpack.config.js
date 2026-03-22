const path = require('path');

module.exports = {
	entry: './src/index.js',
	mode: 'production',
	output: {
		filename: 'friendly-name-parser.min.js',
		path: path.resolve(__dirname, 'dist'),
		library: 'FriendlyNameParser',
		libraryTarget: 'window',
	},
	devtool: 'source-map',
};