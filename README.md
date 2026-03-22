# ✨ Friendly Name Parser
`friendly-name-parser` is a library for Node.js that assists in processing user names into easily readable strings.
The goal of this library is to enhance the readability and security of input data in web applications.


## ✔️ Main features
- **Parsing usernames**: Converts usernames into a format that is easier to read and process in systems.
- **Input data validation**: Checks if the user-input data contains undesirable content, such as HTML, JavaScript (JS), or PHP code, preventing potential code injection attacks.
- **Handling break spaces**: Ensures that usernames do not contain unexpected breaks (e.g., through additional spaces), which is crucial for maintaining data consistency.
- **Validation and normalization of spaces**: The module identifies and normalizes excessive and unusual spaces, ensuring uniformity of input data formatting.
- **Detection and cleaning of code**: The library has the ability to recognize and eliminate HTML, JavaScript, and PHP code from the passed strings, preventing potential XSS attacks and other forms of code injection.
- **Recognition and filtering of URLs and email addresses**: The library can detect and remove URLs and process email addresses from the text.
- **Validation of string structure and content**: Advanced regular expressions are used to detect improper characters, excessive use of periods, and inappropriate use of spaces before punctuation marks, thereby ensuring grammatical and stylistic correctness of the data.
- **Ensuring readability and aesthetics of output data**: Through transformations such as capitalizing appropriate words and removing unnecessary spaces, the library facilitates the creation of text that is not only safe but also aesthetically pleasing.


## 📝 Additional notes
- **Synchronicity**: The library operates synchronously. It does not, for example, affect the server-side query execution time.
- **No dependencies**: The module does not require the installation of additional dependencies, facilitating its integration with existing projects.
- **Support for Node.js and browsers**: The library is compatible with Node.js and web browsers, allowing its versatile use in various environments.


## 🦈 Applications
The **FriendlyNameParser** module was designed to enhance the account registration processes in web applications.
It enables the processing and normalization of input data, which increases the security and readability of information provided by users.


## 📥 Installation
### Node.js
To install this module in a Node environment, use the following npm command:
```bash
npm install friendly-name-parser
```

### 🌍 Browser
If you want to use this module in a browser, you can use the following HTML code:
```html
<script src="https://cdn.jsdelivr.net/npm/friendly-name-parser@1/dist/friendly-name-parser.min.js"></script>
```


## 🐱 Examples
### Username normalization
```js
const FriendlyNameParser = require('friendly-name-parser');

const myUsername = 'I LOVE CUTE cats!!! 💞😻';
const data = FriendlyNameParser(myUsername);
console.log(data.pretty); // "I Love Cute Cats"
```

### Condensed version with more normalization examples (data.pretty)
```js
'<h1>Hello World</h1>'; // "Hello World"
'<script>alert("Hello World")</script>'; // "Hello World"
'😺🔢🤔neko🕵️‍♀️🔥😸📷⚠'; // "Neko"
'sefinek@example.com'; // "Sefinek"
'  Hello   World  '; // "Hello World"
'Hello... World'; // "Hello World"
'Goodbye world 😥🌍👋'; // "Goodbye World"
```

### Full returned object (Regular username)
```js
const FriendlyNameParser = require('friendly-name-parser');

const myUsername = '😻I !!LOVE!! CaTs 💞';
const data = FriendlyNameParser(myUsername);
console.log(data);

// Output:
// {
//     input: '😻I !!LOVE!! CaTs 💞',
//     pretty: 'I Love Cats',
//     isHTML: false,
//     isJS: false,
//     isPHP: false,
//     breakSpaces: false,
//     hasMultilineComments: false,
//     isPlainText: true,
//     detected: []
// }
```

### Full returned object (Username with break spaces and JS code)
```js
const FriendlyNameParser = require('friendly-name-parser');

const myUsername = '<script>alert("l itt le gat ito");</script>';
const data = FriendlyNameParser(myUsername);
console.log(data);

// Output:
// {
//     input: '<script>alert("l itt le gat ito");</script>',
//     pretty: 'Little Gatito',
//     isHTML: true,
//     isJS: true,
//     isPHP: false,
//     breakSpaces: true,
//     hasMultilineComments: false,
//     isPlainText: false,
//     detected: [ 'HTML', 'JS', 'Break spaces' ]
// }
```

### Other Examples
You can find a larger collection of examples in the [examples](examples) folder.


## 🤝 Support
If you encounter any issues or have questions regarding the use of [friendly-name-parser](https://www.npmjs.com/package/friendly-name-parser), please submit an [Issue](https://github.com/sefinek/friendly-name-parser/issues) in the [GitHub repository](https://github.com/sefinek/friendly-name-parser).


## 📑 License
The module is available under the MIT license. Details can be found in the [LICENSE](LICENSE) file in the root directory of the repository.