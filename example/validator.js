const FriendlyNameParser = require('../src/index.js');

const data = [
	'Hello world!',
	'<h1>Injected HTML</h1>',
	'const x = require("malicious-pkg");',
	'<?php echo "pwned"; ?>',
	'/* comment block */ clean text',
	'Hello\u00A0world with break spaces',
	'Perfectly normal text',
];

console.log('=== Validator (new FriendlyNameParser) ===\n');
data.forEach(input => {
	const result = new FriendlyNameParser(input);
	const flags = [
		result.isHTML && 'HTML',
		result.isJS && 'JS',
		result.isPHP && 'PHP',
		result.breakSpaces && 'BreakSpaces',
		result.hasMultilineComments && 'MultilineComments',
	].filter(Boolean);

	console.log(`Input      : ${input}`);
	console.log(`isPlainText: ${result.isPlainText}`);
	console.log(`detected   : ${flags.length ? flags.join(', ') : 'none'}`);
	console.log(`pretty     : ${result.pretty}\n`);
});
