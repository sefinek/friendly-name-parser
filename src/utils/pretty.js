const patterns = require('../patterns.js');

const lowerCaseWords = new Set(['the', 'a', 'an', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by']);
const specialCases = {
	'html': 'HTML',
	'css': 'CSS',
	'js': 'JS',
	'javascript': 'JavaScript',
};

module.exports = inputString => {
	const emailMatch = inputString.match(patterns.email);
	if (emailMatch) {
		const email = emailMatch[0];
		const username = email.split('@')[0];
		const cleanUsername = username
			.replace(/[^\w\s]/gi, '')
			.split(/\s+/)
			.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join('');

		if (cleanUsername.length >= 4) return cleanUsername;
	}

	return inputString
		.replace(patterns.url, '')
		.replace(patterns.breakSpaces, '')
		.replace(patterns.htmlTag, '')
		.replace(patterns.phpTag, '')
		.replace(patterns.jsReserved, '')
		.toLowerCase()
		.replace(patterns.invalidChars, '')
		.replace(patterns.multipleDots, '.')
		.replace(patterns.excessiveSpaces, ' ')
		.replace(patterns.spaceBeforePunctuation, '$1')
		.split(/\s+/)
		.map((word, index) => {
			word = specialCases[word.toLowerCase()] || word;

			if (index === 0 || !lowerCaseWords.has(word.toLowerCase())) {
				return word.charAt(0).toUpperCase() + word.slice(1);
			} else {
				return word.toLowerCase();
			}
		})
		.join(' ')
		.replace(/\s{2,}/g, ' ')
		.replace(/\.$/, '')
		.trim();
};
