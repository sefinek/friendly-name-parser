const readline = require('readline');
const FriendlyNameParser = require('../src/index.js');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question('Enter your username: ', input => {
	if (!input.trim()) {
		console.log('Please enter a username.');
		return rl.close();
	}

	const result = new FriendlyNameParser(input);

	if (!result.pretty) {
		console.log('Could not parse a valid username from the input.');
		return rl.close();
	}

	console.log(`\nHello, ${result.pretty}!`);
	console.log(`Plain text : ${result.isPlainText}`);

	if (result.detected.length) {
		console.log(`Detected   : ${result.detected.join(', ')}`);
	}

	rl.close();
});
