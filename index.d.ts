declare interface FriendlyNameParserResult {
	/** Original input string. */
	input: string;

	/** Normalized, human-readable name with Title Case applied. */
	pretty: string;

	/** `true` if the input contains HTML tags. */
	isHTML: boolean;

	/** `true` if the input contains JavaScript keywords. */
	isJS: boolean;

	/** `true` if the input contains PHP code. */
	isPHP: boolean;

	/** `true` if the input contains Unicode break spaces. */
	breakSpaces: boolean;

	/** `true` if the input contains multiline comments (block or HTML comments). */
	hasMultilineComments: boolean;

	/** `true` if none of the detection flags are set. */
	isPlainText: boolean;

	/**
	 * List of detected issues.
	 * @example ['HTML', 'JS', 'Break spaces']
	 */
	detected: string[];
}

declare class FriendlyNameParser implements FriendlyNameParserResult {
	input: string;
	pretty: string;
	isHTML: boolean;
	isJS: boolean;
	isPHP: boolean;
	breakSpaces: boolean;
	hasMultilineComments: boolean;
	isPlainText: boolean;
	detected: string[];

	/**
	 * Analyzes the input string and returns detection flags along with a normalized name.
	 * @param input - Raw string to analyze.
	 */
	constructor(input: string);

	/**
	 * Normalizes a nickname into a human-readable, Title Cased string.
	 * Removes URLs, HTML tags, PHP code, JS keywords, and special characters.
	 * Emojis are removed. Email addresses are parsed into a username.
	 * @param input - Raw string to normalize.
	 * @returns Normalized name.
	 * @example
	 * FriendlyNameParser.prettyNick('I LOVE cats!!! 💞') // "I Love Cats"
	 * FriendlyNameParser.prettyNick('sefinek@gmail.com') // "Sefinek"
	 */
	static prettyNick(input: string): string;

	/**
	 * Cleans a nickname by removing URLs, HTML tags, PHP code, JS code, and comments.
	 * Emojis are preserved.
	 * @param input - Raw string to clean.
	 * @returns Cleaned string.
	 * @example
	 * FriendlyNameParser.cleanNick('Sefinek 🐱 https://sefinek.net') // "Sefinek 🐱"
	 */
	static cleanNick(input: string): string;

	/**
	 * Cleans a comment or body text by removing HTML tags, PHP code, JS code, and comments.
	 * URLs and emojis are preserved.
	 * @param input - Raw string to clean.
	 * @returns Cleaned string.
	 * @example
	 * FriendlyNameParser.cleanComment('See https://example.com <b>bold</b>') // "See https://example.com bold"
	 */
	static cleanComment(input: string): string;
}

export = FriendlyNameParser;
