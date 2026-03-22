# ✨ Friendly Name Parser
A lightweight, zero-dependency Node.js library for normalizing usernames and comments, with code injection detection (HTML, JS, PHP).

```bash
npm install friendly-name-parser
```


## API

### `new FriendlyNameParser(input)` — analysis
Analyzes the input string and returns an object with the following properties:

| Property               | Type       | Description                                           |
|------------------------|------------|-------------------------------------------------------|
| `input`                | `string`   | Original input                                        |
| `pretty`               | `string`   | Normalized, title-cased name                          |
| `isHTML`               | `boolean`  | Contains HTML tags                                    |
| `isJS`                 | `boolean`  | Contains JavaScript keywords                          |
| `isPHP`                | `boolean`  | Contains PHP code                                     |
| `breakSpaces`          | `boolean`  | Contains Unicode break spaces                         |
| `hasMultilineComments` | `boolean`  | Contains multiline comments (`/* */`, `<!-- -->`)     |
| `isPlainText`          | `boolean`  | `true` if none of the above flags are set             |
| `detected`             | `string[]` | List of detected issues, e.g. `['HTML', 'JS']`        |

### Static methods

| Method                                 | Removes                            | Keeps        |
|----------------------------------------|------------------------------------|--------------|
| `FriendlyNameParser.prettyNick(str)`   | URLs, HTML, PHP, JS, special chars | Emojis       |
| `FriendlyNameParser.cleanNick(str)`    | URLs, HTML, PHP, JS, comments      | Emojis       |
| `FriendlyNameParser.cleanComment(str)` | HTML, PHP, JS, comments            | URLs, Emojis |


## Usage

```js
const FriendlyNameParser = require('friendly-name-parser');

// Static methods
FriendlyNameParser.prettyNick('I LOVE CUTE cats!!! 💞😻');             // "I Love Cute Cats"
FriendlyNameParser.prettyNick('<script>alert("Hello")</script>');       // "Hello"
FriendlyNameParser.prettyNick('sefinek@example.com');                   // "Sefinek"

FriendlyNameParser.cleanNick('Sefinek 🐱 https://sefinek.net <b>x</b>');     // "Sefinek 🐱 x"
FriendlyNameParser.cleanComment('See https://example.com <b>bold</b> text'); // "See https://example.com bold text"

// Full analysis
const result = new FriendlyNameParser('<script>alert("hello world");</script>');
console.log(result);
// {
//   input: '<script>alert("hello world");</script>',
//   pretty: 'Hello World',
//   isHTML: true,
//   isJS: true,
//   isPHP: false,
//   breakSpaces: false,
//   hasMultilineComments: false,
//   isPlainText: false,
//   detected: [ 'HTML', 'JS' ]
// }
```

More examples in the [example](example) folder.


## Browser
```html
<script src="https://cdn.jsdelivr.net/npm/friendly-name-parser@2/dist/friendly-name-parser.min.js"></script>
```


## License
Copyright © [Sefinek](https://sefinek.net). Licensed under the [MIT License](LICENSE).
