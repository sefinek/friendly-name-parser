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

#### `FriendlyNameParser.prettyNick(str)` — normalize a display name
Cleans and formats a string into a readable, title-cased display name.

- Removes: URLs, HTML tags, PHP tags, HTML entities, JS keywords, control characters, invalid characters (anything that's not a letter, digit, `'` or `~`)
- Normalizes: title case (e.g. `hello world` → `Hello World`), excessive spaces, dots
- Special: if the input contains an e-mail address, extracts and title-cases the username part
- Keeps: emojis, Unicode letters (all languages)

#### `FriendlyNameParser.cleanNick(str)` — sanitize a username/nickname
Strips all potentially harmful or noisy content from a username.

- Removes: URLs, e-mails, HTML tags, PHP tags, HTML entities, JS function calls, JS variable declarations, JS keywords, multiline comments (`/* */`, `<!-- -->`), Unicode break/zero-width spaces, control characters
- Normalizes: excessive spaces, multiple dots, space before punctuation
- Keeps: emojis, plain text

#### `FriendlyNameParser.cleanComment(str)` — sanitize a user comment
Same as `cleanNick` but preserves URLs (useful for user-submitted comments or bio text).

- Removes: HTML tags, PHP tags, HTML entities, JS function calls, JS variable declarations, JS keywords, multiline comments (`/* */`, `<!-- -->`), Unicode break/zero-width spaces, control characters
- Normalizes: excessive spaces, multiple dots, space before punctuation
- Keeps: URLs, emojis, plain text


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
