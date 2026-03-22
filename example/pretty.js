const FriendlyNameParser = require('../src/index.js');

const data = [
	'GRzegorz bRZĘCZYSZCZYKIEWICZ!',
	'the quick brown 🟤 fox 🦊 jumps⬆ over the lazy dog 🐶 /:',
	'I am just a https://www.youtube.com/watch?v=keqhcFqp2pI fish in the sea 🐟🐠🐡. DON\'T KILL ME!',
	'    🦀🦐 !!!!!!!!!!!!!Cute neko /,./cat🐈🐱🐈!!!!!!!!!!!! 😭🐟🐠🦈https://www.youtube.com/watch?v=1goAp0XmhZQ    ',
	'<h1>Slava poland</h1>',
	'mIxEd CaSe StRiNgS should be normalized',
	'sefinek@sniffcat.com ',
];

data.forEach(input => {
	console.log(`Input  : ${input}`);
	console.log(`Output : ${FriendlyNameParser.prettyNick(input)}\n`);
});
