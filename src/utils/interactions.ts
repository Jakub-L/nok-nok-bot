import { APIInteractionDataOptionBase } from 'discord-api-types/v10';

/**
 * Retrieves the value of a specific option from an array of options.
 * @param {APIInteractionDataOptionBase[]} options - The array of options to search.
 * @param {string} name - The name of the option to retrieve.
 * @returns {any} The value of the option if found, otherwise null.
 */
export const getOptionValue = (options: APIInteractionDataOptionBase<any, any>[], name: string) => {
	const option = options.find((option) => option.name === name);
	return option ? option.value : null;
};
