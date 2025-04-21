/**
 * Converts a Date object to an ISO date string in the format YYYY-MM-DD.
 * This function extracts only the date part from the ISO string representation
 * of the provided Date object by splitting at the 'T' character and taking the first part.
 *
 * @param {Date} date - The Date object to convert
 * @returns {string} The date in ISO format (YYYY-MM-DD) as a string
 */
export const toISODateString = (date: Date): string => {
	return date.toISOString().split('T')[0];
};

/**
 * Checks if a given date is in the past. Ignores the time part of the date.
 *
 * @param {Date} date - The Date object to check
 * @returns {boolean} True if the date is in the past, false otherwise
 */
export const isDateInPast = (date: Date): boolean => {
	const today = new Date();
	const dateMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
	const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
	return dateMidnight < todayMidnight;
};
