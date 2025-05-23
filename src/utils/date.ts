const MS_PER_MINUTE = 60 * 1000;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
const MS_PER_DAY = 24 * MS_PER_HOUR;
const COMPARISON_THRESHOLD = 5 * MS_PER_MINUTE;

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

/**
 * Checks if a given date is within the past specified number of days. Includes a "leeway" period
 * to account for minor time variances, by default 5 minutes.
 *
 * @param {string} timestamp - The ISO timestamp string to check
 * @param {number} days - The number of days to check against
 * @returns {boolean} True if the date is within the past specified number of days, false otherwise
 */
export const isWithinPastDays = (timestamp: string, days: number): boolean => {
	const past = new Date(Date.now() - days * MS_PER_DAY + COMPARISON_THRESHOLD);
	return new Date(timestamp) > past;
};

export const getTimeUntilGame = (gameHour: number): string => {
	const gameTime = new Date();
	gameTime.setHours(gameHour, 0, 0, 0);
	const timeDiff = gameTime.getTime() - new Date().getTime();

	const hours = Math.floor(timeDiff / MS_PER_HOUR);
	const minutes = Math.floor((timeDiff % MS_PER_HOUR) / MS_PER_MINUTE);

	const result: string[] = [];
	if (hours > 0) result.push(`${hours} hour${hours > 1 ? 's' : ''}`);
	if (minutes > 0) result.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
	if (result.length === 0) result.push('less than a minute');
	return result.join(' and ');
};
