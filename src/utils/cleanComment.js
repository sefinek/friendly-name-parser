const patterns = require('../patterns.js');

module.exports = (inputString, options = {}) => {
	if (typeof inputString !== 'string') throw new TypeError(`Expected a string, got ${typeof inputString}`);

	const { markdown = false } = options;

	let result = inputString;

	if (!markdown) result = result.replace(patterns.multilineComments, ' ');

	result = result
		.replace(patterns.phpTag, ' ')
		.replace(patterns.htmlTag, ' ')
		.replace(patterns.htmlEntities, ' ')
		.replace(patterns.jsCall, ' ')
		.replace(patterns.jsDeclaration, ' ')
		.replace(patterns.jsReserved, ' ')
		.replace(patterns.breakSpaces, ' ')
		.replace(patterns.controlChars, '');

	if (!markdown) {
		result = result
			.replace(patterns.multipleDots, '.')
			.replace(patterns.spaceBeforePunctuation, '$1');
	}

	return result
		.replace(patterns.excessiveSpaces, ' ')
		.trim();
};
