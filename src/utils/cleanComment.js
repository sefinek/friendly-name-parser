const patterns = require('../patterns.js');

module.exports = inputString => {
	return inputString
		.replace(patterns.multilineComments, ' ')
		.replace(patterns.phpTag, ' ')
		.replace(patterns.htmlTag, ' ')
		.replace(patterns.jsCall, ' ')
		.replace(patterns.jsDeclaration, ' ')
		.replace(patterns.jsReserved, ' ')
		.replace(patterns.breakSpaces, ' ')
		.replace(/\s{2,}/g, ' ')
		.trim();
};
