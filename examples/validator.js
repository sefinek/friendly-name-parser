const FriendlyNameParser = require('../src/index.js');

const data = [
	'<code>const username="hello";\\<code>   ',
	'/\\/.  https://d  kEYboard cat https://github.com/sefinek24?tab=repositories    ',
	'    Break  spaces        ',
	'    🦀🦐🦪🐚 !!!!!!!!!!!!!Cute< >?<???> |>?|<>|?> neko  ,/,.<>?<>? /,./cat🐈🐱🐈🐈🐈🐈!!!!!!!!!!!! 😭🐟🐠🦈https://www.youtube.com/watch?v=1goAp0XmhZQ🐌🦋🐛https://www.youtube.com/watch?v=1goAp0XmhZQ    ',
	'<?php echo "Hello World"; ?>',
];

data.forEach(input => {
	console.log(FriendlyNameParser(input));
	console.log();
});