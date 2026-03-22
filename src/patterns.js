module.exports = {
	// Detection
	html: /<\/?[a-z][^>]*>/i,
	jsDetect: /\b(function|var|let|const|if|for|while|switch|return|alert)\b/,
	php: /<\?php[\s\S]*?\?>/i,
	multilineComments: /\/\*[\s\S]*?\*\/|<!--[\s\S]*?-->|#[ \t].*(?:\r?\n|$)/g,
	breakSpaces: /[\u00A0\u00AD\u180E\u1680\u2000-\u200D\u202F\u205F\u2028\u2029\u2060-\u2064\u3000\uFEFF]/g,

	// Removal
	htmlEntities: /&(?:[a-z]+|#\d+|#x[\da-f]+);/gi,
	controlChars: /\p{Cc}/gu,
	jsCall: /\b(alert|require|console\.\w+)\s*\([^)]*\)/gi,
	jsDeclaration: /\b(const|let|var)\s+\w+(\s*=\s*(?:"[^"]*"|'[^']*'|`[^`]*`|\S+))?;?/gi,
	jsReserved: /\b(const|let|var|function|alert|import|export|require)\b/gi,
	url: /https?:\/\/\S+/g,
	email: /\b[\w.+-]+@[\w.-]+\.[a-z]{2,}\b/gi,
	htmlTag: /<[^>]*>/g,
	phpTag: /<\?php.*?\?>/gis,
	invalidChars: /[^\p{L}\p{N}\s'~]/giu,
	multipleDots: /\.{2,}/g,
	excessiveSpaces: /\s{2,}/g,
	spaceBeforePunctuation: /\s([,.])/g,
};
