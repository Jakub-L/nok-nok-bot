/**
 * Converts a given text into a blockquote format. Adds a ">" at the beginning of each line
 * and ensures that multiple newlines are preserved.
 * @param {string} text - Text to convert to blockquote
 * @returns {string} - Text formatted as a blockquote
 */
export const convertToBlockquote = (text: string): string => {
	return `> ${text.replace(/(\n+)/g, '$1> ')}`;
};
