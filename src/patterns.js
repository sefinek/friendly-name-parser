module.exports = {
	// Detection
	html: /<\/?[a-z][\s\S]*>/i,
	jsDetect: /\b(function|var|let|const|if|for|while|switch|return|alert)\b/,
	php: /<\?php[\s\S]*\?>/i,
	multilineComments: /\/\*[\s\S]*?\*\/|<!--[\s\S]*?-->|#.*(?:\r?\n|$)/g,
	breakSpaces: /[\u00A0\u00AD\u180E\u1680\u2000-\u200D\u202F\u205F\u2028\u2029\u2060-\u2064\u3000\uFEFF]/g,

	// Removal
	jsCall: /\b(alert|require|console\.\w+)\s*\([^)]*\)/gi,
	jsDeclaration: /\b(const|let|var)\s+\w+(\s*=\s*(?:"[^"]*"|'[^']*'|`[^`]*`|\S+))?;?/gi,
	url: /https?:\/\/\S+/g,
	email: /(\S+)@\S+\.\S+/g,
	htmlTag: /<[^>]*>/g,
	phpTag: /<\?php.*?\?>/gs,
	jsReserved: /\b(const|let|var|function|alert|import|export|require|return|if|for|while|switch)\b/gi,
	invalidChars: /[^\p{L}\p{N}\s'~]/giu,
	multipleDots: /\.{2,}/g,
	excessiveSpaces: /\s{3,}/g,
	spaceBeforePunctuation: /\s([,.])/g,
};
