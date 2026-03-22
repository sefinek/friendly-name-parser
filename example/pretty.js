const FriendlyNameParser = require('../src/index.js');

const data = [
	'GRzegorz bRZĘCZYSZCZYKIEWICZ!',
	'the quick brown 🟤 fox 🦊 jumps⬆ over the lazy dog 🐶 /:',
	'I am just a https://www.youtube.com/watch?v=keqhcFqp2pI fish in the sea 🐟🐠🐟🦈🐟🐡🐟🐠. DON\'T KILL ME, HELP ME SWIM AWAY',
	'    🦀🦐🦪🐚 !!!!!!!!!!!!!Cute< >?<???> |>?|<>|?> neko  ,/,.<>?<>? /,./cat🐈🐱🐈🐈🐈🐈!!!!!!!!!!!! 😭🐟🐠🦈https://www.youtube.com/watch?v=1goAp0XmhZQ🐌🦋🐛https://www.youtube.com/watch?v=1goAp0XmhZQ    ',
	'<h1>Slava poland</h1>'
];

data.forEach(input => {
	console.log(`Original : ${input}`);
	console.log(`Pretty   : ${FriendlyNameParser(input).pretty}\n`);
});