const FriendlyNameParser = require('../src/index.js');

// ─── Detection ────────────────────────────────────────────────────────────────

describe('#isHTML', () => {
	test('Detects <h1> tag', () => {
		expect(new FriendlyNameParser('<h1>Hello world!</h1>').isHTML).toBe(true);
	});

	test('Detects <code> tag', () => {
		expect(new FriendlyNameParser('<code>Hello</code>').isHTML).toBe(true);
	});

	test('Detects <script> tag', () => {
		expect(new FriendlyNameParser('<script>let x = 1;</script>').isHTML).toBe(true);
	});

	test('Does not flag plain text', () => {
		expect(new FriendlyNameParser('Hello world').isHTML).toBe(false);
	});
});

describe('#isJS', () => {
	test('Detects const keyword', () => {
		expect(new FriendlyNameParser('const x = 1').isJS).toBe(true);
	});

	test('Detects function keyword', () => {
		expect(new FriendlyNameParser('function foo() {}').isJS).toBe(true);
	});

	test('Detects HTTP server snippet', () => {
		expect(new FriendlyNameParser(
			'const server = createServer((req, res) => {\n' +
			'  res.end("Hello World");\n' +
			'});'
		).isJS).toBe(true);
	});

	test('Detects Express.js router snippet', () => {
		expect(new FriendlyNameParser(
			'const express = require("express")\n' +
			'const router = express.Router()\n' +
			'module.exports = router'
		).isJS).toBe(true);
	});

	test('Does not flag plain text', () => {
		expect(new FriendlyNameParser('Hello world').isJS).toBe(false);
	});
});

describe('#isPHP', () => {
	test('Detects PHP block', () => {
		expect(new FriendlyNameParser('<?php echo "hello"; ?>').isPHP).toBe(true);
	});

	test('Does not flag plain text', () => {
		expect(new FriendlyNameParser('Hello world').isPHP).toBe(false);
	});
});

describe('#breakSpaces', () => {
	test('Detects no-break space (U+00A0)', () => {
		expect(new FriendlyNameParser('Hello\u00A0world').breakSpaces).toBe(true);
	});

	test('Detects zero-width space (U+200B)', () => {
		expect(new FriendlyNameParser('Hello\u200Bworld').breakSpaces).toBe(true);
	});

	test('Detects zero-width joiner (U+200D)', () => {
		expect(new FriendlyNameParser('Hello\u200Dworld').breakSpaces).toBe(true);
	});

	test('Detects BOM / zero-width no-break space (U+FEFF)', () => {
		expect(new FriendlyNameParser('\uFEFFHello').breakSpaces).toBe(true);
	});

	test('Detects Mongolian vowel separator (U+180E)', () => {
		expect(new FriendlyNameParser('Hello\u180Eworld').breakSpaces).toBe(true);
	});

	test('Detects soft hyphen (U+00AD)', () => {
		expect(new FriendlyNameParser('Hello\u00ADworld').breakSpaces).toBe(true);
	});

	test('Does not flag plain text', () => {
		expect(new FriendlyNameParser('Hello world').breakSpaces).toBe(false);
	});
});

describe('#hasMultilineComments', () => {
	test('Detects block comment /* */', () => {
		expect(new FriendlyNameParser('/* this is a comment */').hasMultilineComments).toBe(true);
	});

	test('Detects HTML comment <!-- -->', () => {
		expect(new FriendlyNameParser('<!-- hidden comment -->').hasMultilineComments).toBe(true);
	});

	test('Detects hash comment', () => {
		expect(new FriendlyNameParser('# this is a comment\nhello').hasMultilineComments).toBe(true);
	});

	test('Does not flag plain text', () => {
		expect(new FriendlyNameParser('Hello world').hasMultilineComments).toBe(false);
	});
});

describe('#isPlainText', () => {
	test('Plain text returns true', () => {
		expect(new FriendlyNameParser('Hello world').isPlainText).toBe(true);
	});

	test('HTML input returns false', () => {
		expect(new FriendlyNameParser('<h1>Hello</h1>').isPlainText).toBe(false);
	});

	test('JS input returns false', () => {
		expect(new FriendlyNameParser('const x = 1').isPlainText).toBe(false);
	});

	test('PHP input returns false', () => {
		expect(new FriendlyNameParser('<?php echo "x"; ?>').isPlainText).toBe(false);
	});
});

describe('#detected', () => {
	test('Returns empty array for plain text', () => {
		expect(new FriendlyNameParser('Hello world').detected).toEqual([]);
	});

	test('Returns [HTML] for HTML input', () => {
		expect(new FriendlyNameParser('<b>bold</b>').detected).toEqual(['HTML']);
	});

	test('Returns [PHP] for PHP input', () => {
		expect(new FriendlyNameParser('<?php echo "x"; ?>').detected).toEqual(['PHP']);
	});

	test('Returns [HTML, JS] for script tag', () => {
		expect(new FriendlyNameParser('<script>const x = 1;</script>').detected).toEqual(['HTML', 'JS']);
	});

	test('Returns [Multiline comments] for block comment', () => {
		expect(new FriendlyNameParser('/* comment */').detected).toEqual(['Multiline comments']);
	});
});

// ─── pretty ───────────────────────────────────────────────────────────────────

describe('pretty', () => {
	test('Removes <h1> tag', () => {
		expect(new FriendlyNameParser('<h1>Hello world!</h1>').pretty).toBe('Hello World');
	});

	test('Removes <code> tag', () => {
		expect(new FriendlyNameParser('<code>const cat = "Keyboard cat";</code>').pretty).toBe('Cat Keyboard Cat');
	});

	test('Removes <script> tag', () => {
		expect(new FriendlyNameParser('<script>alert("Neko~chan")</script>').pretty).toBe('Neko~chan');
	});

	test('Removes nested HTML tags', () => {
		expect(new FriendlyNameParser('<div><span>Nested <b>HTML</b> content</span></div>').pretty).toBe('Nested HTML Content');
	});

	test('Extracts username from email address', () => {
		expect(new FriendlyNameParser('vfdg fdsa <?>#0@$%<?ó@>#$<%@ł#$ż?>%ń<@#?> $SefInek.@gmail.com j asdfasd').pretty).toBe('Sefinek');
	});

	test('Removes URL', () => {
		expect(new FriendlyNameParser('Sefinek (https://sefinek.net)').pretty).toBe('Sefinek');
	});

	test('Removes multiple URLs', () => {
		expect(new FriendlyNameParser('/.  https://d  kEYboard cat https://github.com/sefinek24 ./ ').pretty).toBe('Keyboard Cat');
	});

	test('Handles Polish characters', () => {
		expect(new FriendlyNameParser('GRzegorz Brzęczyszczykiewicz').pretty).toBe('Grzegorz Brzęczyszczykiewicz');
	});

	test('Trims and normalizes whitespace', () => {
		expect(new FriendlyNameParser('\t\tI love \tcats ').pretty).toBe('I Love Cats');
	});

	test('Removes emojis', () => {
		expect(new FriendlyNameParser('Meow! 🐱🐱🐱').pretty).toBe('Meow');
	});

	test('Removes emojis interspersed in text', () => {
		expect(new FriendlyNameParser('!!😸S😸e😸f😸i😸!!').pretty).toBe('Sefi');
	});

	test('Handles emojis in a sentence', () => {
		expect(new FriendlyNameParser('Quick fox🦊 jumps over^ the lazy <- dog🐶.').pretty).toBe('Quick Fox Jumps Over the Lazy Dog');
	});

	test('Removes special characters from both sides', () => {
		expect(new FriendlyNameParser('.-^Just a cat^-.').pretty).toBe('Just a Cat');
	});

	test('Handles long string with links and emojis', () => {
		expect(new FriendlyNameParser('🦀🦐 !!!!!!!!!!!!!I AM JUST A FISH!!!!!!!!!!!! 😭🐟🐠🦈https://www.youtube.com/watch?v=1goAp0XmhZQ    ').pretty).toBe('I Am Just a Fish');
	});

	test('Removes non-breaking spaces (U+00A0)', () => {
		expect(new FriendlyNameParser('S\u00A0e\u00A0F\u00A0i\u00A0N\u00A0e\u00A0K').pretty).toBe('Sefinek');
	});

	test('Removes zero-width spaces (U+200B)', () => {
		expect(new FriendlyNameParser('S\u200Be\u200Bf\u200Bi\u200Bn\u200Be\u200Bk').pretty).toBe('Sefinek');
	});

	test('Removes markdown links', () => {
		expect(new FriendlyNameParser('Check out my [blog](https://myblog.com)!').pretty).toBe('Check Out My Blog');
	});

	test('Removes special characters', () => {
		expect(new FriendlyNameParser('Special &characters* should# be$ cleaned@ up%!').pretty).toBe('Special Characters Should Be Cleaned Up');
	});

	test('Normalizes mixed case', () => {
		expect(new FriendlyNameParser('mIxEd CaSe StRiNgS should be normalized').pretty).toBe('Mixed Case Strings Should Be Normalized');
	});

	test('Keeps lowerCaseWords lowercase when not first word', () => {
		expect(new FriendlyNameParser('Jack and Jill on the hill').pretty).toBe('Jack and Jill on the Hill');
	});

	test('Capitalizes lowerCaseWord when it is the first word', () => {
		expect(new FriendlyNameParser('the quick brown fox').pretty).toBe('The Quick Brown Fox');
	});

	test('Applies special case: html → HTML', () => {
		expect(new FriendlyNameParser('learn html today').pretty).toBe('Learn HTML Today');
	});

	test('Applies special case: css → CSS', () => {
		expect(new FriendlyNameParser('learn css today').pretty).toBe('Learn CSS Today');
	});

	test('Applies special case: js → JS', () => {
		expect(new FriendlyNameParser('learn js today').pretty).toBe('Learn JS Today');
	});

	test('Applies special case: javascript → JavaScript', () => {
		expect(new FriendlyNameParser('learn javascript today').pretty).toBe('Learn JavaScript Today');
	});
});

// ─── Static methods ───────────────────────────────────────────────────────────

describe('FriendlyNameParser.prettyNick', () => {
	test('Normalizes Polish nickname', () => {
		expect(FriendlyNameParser.prettyNick('gRzegoRZ brzęczyszczykiewicz!!!')).toBe('Grzegorz Brzęczyszczykiewicz');
	});

	test('Extracts name from email', () => {
		expect(FriendlyNameParser.prettyNick('sefinek@gmail.com')).toBe('Sefinek');
	});

	test('Removes HTML tags', () => {
		expect(FriendlyNameParser.prettyNick('<h1>Hello world</h1>')).toBe('Hello World');
	});

	test('Removes emojis', () => {
		expect(FriendlyNameParser.prettyNick('Hello 🐱 world')).toBe('Hello World');
	});
});

describe('FriendlyNameParser.cleanNick', () => {
	test('Removes URL', () => {
		expect(FriendlyNameParser.cleanNick('Sefinek https://sefinek.net')).toBe('Sefinek');
	});

	test('Removes HTML tags', () => {
		expect(FriendlyNameParser.cleanNick('Hello <b>world</b>')).toBe('Hello world');
	});

	test('Removes PHP block', () => {
		expect(FriendlyNameParser.cleanNick('Hello <?php echo "x"; ?> world')).toBe('Hello world');
	});

	test('Removes JS function call', () => {
		expect(FriendlyNameParser.cleanNick('test alert("hello") end')).toBe('test end');
	});

	test('Removes JS variable declaration', () => {
		expect(FriendlyNameParser.cleanNick('test const x = 1 end')).toBe('test end');
	});

	test('Removes block comment', () => {
		expect(FriendlyNameParser.cleanNick('Hello /* comment */ world')).toBe('Hello world');
	});

	test('Preserves emojis', () => {
		expect(FriendlyNameParser.cleanNick('Sefinek 🐱 https://sefinek.net')).toBe('Sefinek 🐱');
	});
});

describe('FriendlyNameParser.cleanComment', () => {
	test('Keeps URL', () => {
		expect(FriendlyNameParser.cleanComment('See https://sefinek.net for details')).toContain('https://sefinek.net');
	});

	test('Removes HTML tags', () => {
		expect(FriendlyNameParser.cleanComment('<b>bold</b> text')).toBe('bold text');
	});

	test('Removes PHP block', () => {
		expect(FriendlyNameParser.cleanComment('Hello <?php echo "x"; ?> world')).toBe('Hello world');
	});

	test('Removes JS function call', () => {
		expect(FriendlyNameParser.cleanComment('test alert("hello") end')).toBe('test end');
	});

	test('Removes JS variable declaration', () => {
		expect(FriendlyNameParser.cleanComment('test const x = 1 end')).toBe('test end');
	});

	test('Removes block comment', () => {
		expect(FriendlyNameParser.cleanComment('Hello /* comment */ world')).toBe('Hello world');
	});

	test('Removes HTML comment', () => {
		expect(FriendlyNameParser.cleanComment('Hello <!-- hidden --> world')).toBe('Hello world');
	});

	test('Preserves emojis', () => {
		expect(FriendlyNameParser.cleanComment('Hello 🐱 world')).toBe('Hello 🐱 world');
	});
});
