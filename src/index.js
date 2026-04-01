const patterns = require('./patterns.js');
const prettyNick = require('./utils/pretty.js');
const cleanNick = require('./utils/cleanNick.js');
const cleanComment = require('./utils/cleanComment.js');
const DETECTED_LABELS = { isHTML: 'HTML', isJS: 'JS', isPHP: 'PHP', breakSpaces: 'Break spaces', hasMultilineComments: 'Multiline comments' };

class FriendlyNameParser {
	constructor(inputString) {
		if (typeof inputString !== 'string') throw new TypeError(`Expected a string, got ${typeof inputString}`);

		patterns.breakSpaces.lastIndex = 0;
		patterns.multilineComments.lastIndex = 0;

		this.pretty = prettyNick(inputString);
		this.isHTML = patterns.html.test(inputString);
		this.isJS = patterns.jsDetect.test(inputString);
		this.isPHP = patterns.php.test(inputString);
		this.breakSpaces = patterns.breakSpaces.test(inputString);
		this.hasMultilineComments = patterns.multilineComments.test(inputString);
		this.isPlainText = !this.isHTML && !this.isJS && !this.isPHP && !this.breakSpaces && !this.hasMultilineComments;
		this.detected = Object.keys(DETECTED_LABELS).filter(key => this[key] === true).map(key => DETECTED_LABELS[key]);
	}

	static prettyNick(inputString) {
		return prettyNick(inputString);
	}

	static cleanNick(inputString) {
		return cleanNick(inputString);
	}

	static cleanComment(inputString, options) {
		return cleanComment(inputString, options);
	}
}

module.exports = FriendlyNameParser;
