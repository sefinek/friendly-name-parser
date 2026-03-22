const patterns = require('./patterns.js');
const prettyNick = require('./utils/pretty.js');
const cleanNick = require('./utils/cleanNick.js');
const cleanComment = require('./utils/cleanComment.js');

class FriendlyNameParser {
	constructor(inputString) {
		if (typeof inputString !== 'string') throw new TypeError(`Expected a string, got ${typeof inputString}`);

		patterns.breakSpaces.lastIndex = 0;
		patterns.multilineComments.lastIndex = 0;

		this.input = inputString;
		this.pretty = prettyNick(inputString);
		this.isHTML = patterns.html.test(inputString);
		this.isJS = patterns.jsDetect.test(inputString);
		this.isPHP = patterns.php.test(inputString);
		this.breakSpaces = patterns.breakSpaces.test(inputString);
		this.hasMultilineComments = patterns.multilineComments.test(inputString);
		this.isPlainText = ![this.isHTML, this.isJS, this.isPHP, this.breakSpaces, this.hasMultilineComments].includes(true);
		this.detected = ['isHTML', 'isJS', 'isPHP', 'breakSpaces', 'hasMultilineComments']
			.filter(key => this[key] === true)
			.map(key => key
				.replace('is', '')
				.replace('breakSpaces', 'Break spaces')
				.replace('hasMultilineComments', 'Multiline comments')
			);
	}

	static prettyNick(inputString) {
		return prettyNick(inputString);
	}

	static cleanNick(inputString) {
		return cleanNick(inputString);
	}

	static cleanComment(inputString) {
		return cleanComment(inputString);
	}
}

module.exports = FriendlyNameParser;
