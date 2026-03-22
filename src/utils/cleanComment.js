const patterns = require('../patterns.js');

module.exports = inputString => {
	if (typeof inputString !== 'string') throw new TypeError(`Expected a string, got ${typeof inputString}`);

	return inputString
		.replace(patterns.multilineComments, ' ')
		.replace(patterns.phpTag, ' ')
		.replace(patterns.htmlTag, ' ')
		.replace(patterns.htmlEntities, ' ')
		.replace(patterns.jsCall, ' ')
		.replace(patterns.jsDeclaration, ' ')
		.replace(patterns.jsReserved, ' ')
		.replace(patterns.breakSpaces, ' ')
		.replace(patterns.controlChars, '')
		.replace(patterns.multipleDots, '.')
		.replace(patterns.spaceBeforePunctuation, '$1')
		.replace(patterns.excessiveSpaces, ' ')
		.trim();
};
