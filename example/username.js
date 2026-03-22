const readline = require('readline');
const FriendlyNameParser = require('../src/index.js');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question('Enter your username: ', output => {
	if (!output) {
		console.log('Please enter a username');
		return rl.close();
	}

	const username = FriendlyNameParser(output);
	if (username.pretty === '') {
		console.log('Invalid username');
		return rl.close();
	}

	console.log(`Hello, ${username.pretty}! Your username is ${username.isPlainText ? 'valid' : 'INVALID'}.`);
	rl.close();
});