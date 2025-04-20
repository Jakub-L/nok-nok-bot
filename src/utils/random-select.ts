/**
 * Randomly selects an item from an array.
 * @param {T} arr - Array of items to select from
 * @returns {T} Randomly selected item from the array
 */
export const randomSelect = <T>(arr: T[]): T => {
	return arr[Math.floor(Math.random() * arr.length)];
};
