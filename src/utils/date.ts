import { DateTime } from 'luxon';

const MS_PER_MINUTE = 60 * 1000;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
const MS_PER_DAY = 24 * MS_PER_HOUR;
const COMPARISON_THRESHOLD = 5 * MS_PER_MINUTE;

/**
 * Checks if a given date is in the past. Ignores the time part of the date.
 *
 * @param {Date} date - The Date object to check
 * @returns {boolean} True if the date is in the past, false otherwise
 */
export const isDateInPast = (date: Date): boolean => {
	return DateTime.fromJSDate(date, { zone: 'Europe/London' }).diffNow().milliseconds < 0;
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
	return (
		DateTime.fromISO(timestamp).diffNow(['days']).days > -(days + COMPARISON_THRESHOLD / MS_PER_DAY)
	);
};

export const getTimeUntilGame = (gameHour: number): string => {
	const gameTime = DateTime.now().setZone('Europe/London').set({ hour: gameHour }).startOf('hour');
	const diff = gameTime.diffNow(['hours', 'minutes']);

	if (diff.hours === 0 && diff.minutes <= 5) return 'less than 5 minutes';
	return diff.toHuman({ listStyle: 'long', maximumFractionDigits: 0 });
};
