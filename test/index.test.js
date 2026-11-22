const { describe, test } = require('node:test');
const assert = require('node:assert/strict');
const FriendlyNameParser = require('../src/index.js');

// ─── Detection ────────────────────────────────────────────────────────────────

describe('#isHTML', () => {
	test('Detects <h1> tag', () => {
		assert.equal(new FriendlyNameParser('<h1>Hello world!</h1>').isHTML, true);
	});

	test('Detects <code> tag', () => {
		assert.equal(new FriendlyNameParser('<code>Hello</code>').isHTML, true);
	});

	test('Detects <script> tag', () => {
		assert.equal(new FriendlyNameParser('<script>let x = 1;</script>').isHTML, true);
	});

	test('Does not flag plain text', () => {
		assert.equal(new FriendlyNameParser('Hello world').isHTML, false);
	});
});

describe('#isJS', () => {
	test('Detects const keyword', () => {
		assert.equal(new FriendlyNameParser('const x = 1').isJS, true);
	});

	test('Detects function keyword', () => {
		assert.equal(new FriendlyNameParser('function foo() {}').isJS, true);
	});

	test('Detects HTTP server snippet', () => {
		assert.equal(new FriendlyNameParser(
			'const server = createServer((req, res) => {\n' +
			'  res.end("Hello World");\n' +
			'});'
		).isJS, true);
	});

	test('Detects Express.js router snippet', () => {
		assert.equal(new FriendlyNameParser(
			'const express = require("express")\n' +
			'const router = express.Router()\n' +
			'module.exports = router'
		).isJS, true);
	});

	test('Does not flag plain text', () => {
		assert.equal(new FriendlyNameParser('Hello world').isJS, false);
	});
});

describe('#isPHP', () => {
	test('Detects PHP block', () => {
		assert.equal(new FriendlyNameParser('<?php echo "hello"; ?>').isPHP, true);
	});

	test('Does not flag plain text', () => {
		assert.equal(new FriendlyNameParser('Hello world').isPHP, false);
	});
});

describe('#breakSpaces', () => {
	test('Detects no-break space (U+00A0)', () => {
		assert.equal(new FriendlyNameParser('Hello\u00A0world').breakSpaces, true);
	});

	test('Detects zero-width space (U+200B)', () => {
		assert.equal(new FriendlyNameParser('Hello\u200Bworld').breakSpaces, true);
	});

	test('Detects zero-width joiner (U+200D)', () => {
		assert.equal(new FriendlyNameParser('Hello\u200Dworld').breakSpaces, true);
	});

	test('Detects BOM / zero-width no-break space (U+FEFF)', () => {
		assert.equal(new FriendlyNameParser('\uFEFFHello').breakSpaces, true);
	});

	test('Detects Mongolian vowel separator (U+180E)', () => {
		assert.equal(new FriendlyNameParser('Hello\u180Eworld').breakSpaces, true);
	});

	test('Detects soft hyphen (U+00AD)', () => {
		assert.equal(new FriendlyNameParser('Hello\u00ADworld').breakSpaces, true);
	});

	test('Does not flag plain text', () => {
		assert.equal(new FriendlyNameParser('Hello world').breakSpaces, false);
	});
});

describe('#hasMultilineComments', () => {
	test('Detects block comment /* */', () => {
		assert.equal(new FriendlyNameParser('/* this is a comment */').hasMultilineComments, true);
	});

	test('Detects HTML comment <!-- -->', () => {
		assert.equal(new FriendlyNameParser('<!-- hidden comment -->').hasMultilineComments, true);
	});

	test('Detects hash comment', () => {
		assert.equal(new FriendlyNameParser('# this is a comment\nhello').hasMultilineComments, true);
	});

	test('Does not flag plain text', () => {
		assert.equal(new FriendlyNameParser('Hello world').hasMultilineComments, false);
	});
});

describe('#isPlainText', () => {
	test('Plain text returns true', () => {
		assert.equal(new FriendlyNameParser('Hello world').isPlainText, true);
	});

	test('HTML input returns false', () => {
		assert.equal(new FriendlyNameParser('<h1>Hello</h1>').isPlainText, false);
	});

	test('JS input returns false', () => {
		assert.equal(new FriendlyNameParser('const x = 1').isPlainText, false);
	});

	test('PHP input returns false', () => {
		assert.equal(new FriendlyNameParser('<?php echo "x"; ?>').isPlainText, false);
	});
});

describe('#detected', () => {
	test('Returns empty array for plain text', () => {
		assert.deepEqual(new FriendlyNameParser('Hello world').detected, []);
	});

	test('Returns [HTML] for HTML input', () => {
		assert.deepEqual(new FriendlyNameParser('<b>bold</b>').detected, ['HTML']);
	});

	test('Returns [PHP] for PHP input', () => {
		assert.deepEqual(new FriendlyNameParser('<?php echo "x"; ?>').detected, ['PHP']);
	});

	test('Returns [HTML, JS] for script tag', () => {
		assert.deepEqual(new FriendlyNameParser('<script>const x = 1;</script>').detected, ['HTML', 'JS']);
	});

	test('Returns [Multiline comments] for block comment', () => {
		assert.deepEqual(new FriendlyNameParser('/* comment */').detected, ['Multiline comments']);
	});
});

// ─── pretty ───────────────────────────────────────────────────────────────────

describe('pretty', () => {
	test('Removes <h1> tag', () => {
		assert.equal(new FriendlyNameParser('<h1>Hello world!</h1>').pretty, 'Hello World');
	});

	test('Removes <code> tag', () => {
		assert.equal(new FriendlyNameParser('<code>const cat = "Keyboard cat";</code>').pretty, 'Cat Keyboard Cat');
	});

	test('Removes <script> tag', () => {
		assert.equal(new FriendlyNameParser('<script>alert("Neko~chan")</script>').pretty, 'Neko~chan');
	});

	test('Removes nested HTML tags', () => {
		assert.equal(new FriendlyNameParser('<div><span>Nested <b>HTML</b> content</span></div>').pretty, 'Nested HTML Content');
	});

	test('Extracts username from email address', () => {
		assert.equal(new FriendlyNameParser('vfdg fdsa <?>#0@$%<?ó@>#$<%@ł#$ż?>%ń<@#?> $SefInek.@gmail.com j asdfasd').pretty, 'Sefinek');
	});

	test('Removes URL', () => {
		assert.equal(new FriendlyNameParser('Sefinek (https://sefinek.net)').pretty, 'Sefinek');
	});

	test('Removes multiple URLs', () => {
		assert.equal(new FriendlyNameParser('/.  https://d  kEYboard cat https://github.com/sefinek24 ./ ').pretty, 'Keyboard Cat');
	});

	test('Handles Polish characters', () => {
		assert.equal(new FriendlyNameParser('GRzegorz Brzęczyszczykiewicz').pretty, 'Grzegorz Brzęczyszczykiewicz');
	});

	test('Trims and normalizes whitespace', () => {
		assert.equal(new FriendlyNameParser('\t\tI love \tcats ').pretty, 'I Love Cats');
	});

	test('Removes emojis', () => {
		assert.equal(new FriendlyNameParser('Meow! 🐱🐱🐱').pretty, 'Meow');
	});

	test('Removes emojis interspersed in text', () => {
		assert.equal(new FriendlyNameParser('!!😸S😸e😸f😸i😸!!').pretty, 'Sefi');
	});

	test('Handles emojis in a sentence', () => {
		assert.equal(new FriendlyNameParser('Quick fox🦊 jumps over^ the lazy <- dog🐶.').pretty, 'Quick Fox Jumps Over the Lazy Dog');
	});

	test('Removes special characters from both sides', () => {
		assert.equal(new FriendlyNameParser('.-^Just a cat^-.').pretty, 'Just a Cat');
	});

	test('Handles long string with links and emojis', () => {
		assert.equal(new FriendlyNameParser('🦀🦐 !!!!!!!!!!!!!I AM JUST A FISH!!!!!!!!!!!! 😭🐟🐠🦈https://www.youtube.com/watch?v=1goAp0XmhZQ    ').pretty, 'I Am Just a Fish');
	});

	test('Removes non-breaking spaces (U+00A0)', () => {
		assert.equal(new FriendlyNameParser('S\u00A0e\u00A0F\u00A0i\u00A0N\u00A0e\u00A0K').pretty, 'Sefinek');
	});

	test('Removes zero-width spaces (U+200B)', () => {
		assert.equal(new FriendlyNameParser('S\u200Be\u200Bf\u200Bi\u200Bn\u200Be\u200Bk').pretty, 'Sefinek');
	});

	test('Removes markdown links', () => {
		assert.equal(new FriendlyNameParser('Check out my [blog](https://myblog.com)!').pretty, 'Check Out My Blog');
	});

	test('Removes special characters', () => {
		assert.equal(new FriendlyNameParser('Special &characters* should# be$ cleaned@ up%!').pretty, 'Special Characters Should Be Cleaned Up');
	});

	test('Normalizes mixed case', () => {
		assert.equal(new FriendlyNameParser('mIxEd CaSe StRiNgS should be normalized').pretty, 'Mixed Case Strings Should Be Normalized');
	});

	test('Keeps lowerCaseWords lowercase when not first word', () => {
		assert.equal(new FriendlyNameParser('Jack and Jill on the hill').pretty, 'Jack and Jill on the Hill');
	});

	test('Capitalizes lowerCaseWord when it is the first word', () => {
		assert.equal(new FriendlyNameParser('the quick brown fox').pretty, 'The Quick Brown Fox');
	});

	test('Applies special case: html → HTML', () => {
		assert.equal(new FriendlyNameParser('learn html today').pretty, 'Learn HTML Today');
	});

	test('Applies special case: css → CSS', () => {
		assert.equal(new FriendlyNameParser('learn css today').pretty, 'Learn CSS Today');
	});

	test('Applies special case: js → JS', () => {
		assert.equal(new FriendlyNameParser('learn js today').pretty, 'Learn JS Today');
	});

	test('Applies special case: javascript → JavaScript', () => {
		assert.equal(new FriendlyNameParser('learn javascript today').pretty, 'Learn JavaScript Today');
	});
});

// ─── Static methods ───────────────────────────────────────────────────────────

describe('FriendlyNameParser.prettyNick', () => {
	test('Normalizes Polish nickname', () => {
		assert.equal(FriendlyNameParser.prettyNick('gRzegoRZ brzęczyszczykiewicz!!!'), 'Grzegorz Brzęczyszczykiewicz');
	});

	test('Extracts name from email', () => {
		assert.equal(FriendlyNameParser.prettyNick('sefinek@gmail.com'), 'Sefinek');
	});

	test('Removes HTML tags', () => {
		assert.equal(FriendlyNameParser.prettyNick('<h1>Hello world</h1>'), 'Hello World');
	});

	test('Removes emojis', () => {
		assert.equal(FriendlyNameParser.prettyNick('Hello 🐱 world'), 'Hello World');
	});
});

describe('FriendlyNameParser.cleanNick', () => {
	test('Removes URL', () => {
		assert.equal(FriendlyNameParser.cleanNick('Sefinek https://sefinek.net'), 'Sefinek');
	});

	test('Removes HTML tags', () => {
		assert.equal(FriendlyNameParser.cleanNick('Hello <b>world</b>'), 'Hello world');
	});

	test('Removes PHP block', () => {
		assert.equal(FriendlyNameParser.cleanNick('Hello <?php echo "x"; ?> world'), 'Hello world');
	});

	test('Removes JS function call', () => {
		assert.equal(FriendlyNameParser.cleanNick('test alert("hello") end'), 'test end');
	});

	test('Removes JS variable declaration', () => {
		assert.equal(FriendlyNameParser.cleanNick('test const x = 1 end'), 'test end');
	});

	test('Removes block comment', () => {
		assert.equal(FriendlyNameParser.cleanNick('Hello /* comment */ world'), 'Hello world');
	});

	test('Preserves emojis', () => {
		assert.equal(FriendlyNameParser.cleanNick('Sefinek 🐱 https://sefinek.net'), 'Sefinek 🐱');
	});
});

describe('FriendlyNameParser.cleanComment', () => {
	test('Keeps URL', () => {
		assert.ok(FriendlyNameParser.cleanComment('See https://sefinek.net for details').includes('https://sefinek.net'));
	});

	test('Removes HTML tags', () => {
		assert.equal(FriendlyNameParser.cleanComment('<b>bold</b> text'), 'bold text');
	});

	test('Removes PHP block', () => {
		assert.equal(FriendlyNameParser.cleanComment('Hello <?php echo "x"; ?> world'), 'Hello world');
	});

	test('Removes JS function call', () => {
		assert.equal(FriendlyNameParser.cleanComment('test alert("hello") end'), 'test end');
	});

	test('Removes JS variable declaration', () => {
		assert.equal(FriendlyNameParser.cleanComment('test const x = 1 end'), 'test end');
	});

	test('Removes block comment', () => {
		assert.equal(FriendlyNameParser.cleanComment('Hello /* comment */ world'), 'Hello world');
	});

	test('Removes HTML comment', () => {
		assert.equal(FriendlyNameParser.cleanComment('Hello <!-- hidden --> world'), 'Hello world');
	});

	test('Preserves emojis', () => {
		assert.equal(FriendlyNameParser.cleanComment('Hello 🐱 world'), 'Hello 🐱 world');
	});

	describe('markdown option', () => {
		test('Preserves # headings when markdown: true', () => {
			assert.ok(FriendlyNameParser.cleanComment('# Heading\nsome text', { markdown: true }).includes('# Heading'));
		});

		test('Strips # headings when markdown: false (default)', () => {
			assert.ok(!FriendlyNameParser.cleanComment('# Heading\nsome text').includes('# Heading'));
		});

		test('Preserves multiple dots when markdown: true', () => {
			assert.ok(FriendlyNameParser.cleanComment('Wait...', { markdown: true }).includes('...'));
		});

		test('Still removes HTML tags when markdown: true', () => {
			assert.equal(FriendlyNameParser.cleanComment('<b>bold</b>', { markdown: true }), 'bold');
		});

		test('Still removes JS code when markdown: true', () => {
			assert.equal(FriendlyNameParser.cleanComment('test alert("x") end', { markdown: true }), 'test end');
		});
	});
});
