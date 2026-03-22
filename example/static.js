const FriendlyNameParser = require('../src/index.js');

const samples = [
	'Sefinek 🐱 https://sefinek.net <b>bold</b> const x = 1',
	'Check out https://example.com — <script>alert(1)</script> great site!',
	'<?php echo "hello"; ?> normal text /* comment */ more text',
];

// cleanNick vs cleanComment — key difference: URLs
samples.forEach(input => {
	console.log(`Input        : ${input}`);
	console.log(`cleanNick    : ${FriendlyNameParser.cleanNick(input)}`);
	console.log(`cleanComment : ${FriendlyNameParser.cleanComment(input)}\n`);
});
