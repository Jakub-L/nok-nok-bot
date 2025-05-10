/**
 * Options for making a Discord API request.
 *
 * @interface DiscordRequestOptions
 * @property {string} method - The HTTP method to use for the request (e.g., 'GET', 'POST', 'PUT', 'DELETE').
 * @property {any} [body] - Optional payload to send with the request. Can be any serializable data.
 */
interface DiscordRequestOptions {
	method: string;
	body?: any;
}

/**
 * Makes a request to Discord's API with the provided options.
 *
 * @param {string} url - The endpoint URL to request (without the base URL).
 * @param {DiscordRequestOptions} options - The request options including method and optional body.
 * @param {any} env - The environment object containing Discord token and other configuration.
 * @returns {Promise<Response>} A promise that resolves to the fetch Response object.
 */
export const discordRequest = async (url: string, options: DiscordRequestOptions, env: any) => {
	console.log('discordRequest: initializing');

	const headers: Record<string, string> = { Authorization: `Bot ${env.DISCORD_TOKEN}` };

	if (options.body) headers['Content-Type'] = 'application/json';
	console.log('discordRequest: headers', headers);
	try {
		const res = await fetch(`https://discord.com/api/v10/${url}`, {
			method: options.method,
			body: options.body ? JSON.stringify(options.body) : undefined,
			headers
		});
		console.log('res', res?.json());
		return res;
	} catch (error) {
		console.error('Error making Discord API request:', error);
		return null;
	}
};

/**
 * Fetches the most recent messages (up to 100) from a specified Discord channel.
 *
 * @param {any} env - The environment object containing Discord configuration including channel ID.
 * @returns {Promise<Array<any>>} A promise that resolves to an array of message objects from the Discord API.
 */
export const getChannelMessages = async (env: any) => {
	console.log('getChannelMessages: initializing');
	try {
		const response = await discordRequest(
			`channels/${env.DISCORD_CHANNEL_ID}/messages?limit=100`,
			{ method: 'GET' },
			env
		);
		console.log('getChannelMessages: response', response?.json());
		return await response?.json();
	} catch (error) {
		console.error('Error fetching channel messages:', error);
		return [];
	}
};

/**
 * Deletes one or more messages from a Discord channel.
 * Uses different API endpoints based on the number of messages to delete.
 *
 * @param {string[]} messages - Array of message IDs to delete.
 * @param {any} env - The environment object containing Discord configuration including channel ID.
 * @returns {Promise<void>} A promise that resolves when the deletion is complete.
 * @throws {Error} Throws an error if attempting to delete more than 100 messages at once.
 */
export const deleteMessages = async (messages: string[], env: any) => {
	if (messages.length === 0) return;
	if (messages.length > 100) throw new Error('Cannot delete more than 100 messages at once');
	if (messages.length === 1) {
		await discordRequest(
			`channels/${env.DISCORD_CHANNEL_ID}/messages/${messages[0]}`,
			{ method: 'DELETE' },
			env
		);
	} else {
		await discordRequest(
			`channels/${env.DISCORD_CHANNEL_ID}/messages/bulk-delete`,
			{
				method: 'POST',
				body: { messages }
			},
			env
		);
	}
};
