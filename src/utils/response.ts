import { InteractionResponseType, MessageFlags } from 'discord-api-types/v10';

/** JSON Response to a request */
export class JsonResponse extends Response {
	constructor(
		body: any,
		init: Record<string, any> = {
			headers: {
				'content-type': 'application/json;charset=UTF-8'
			}
		}
	) {
		const jsonBody = JSON.stringify(body);
		super(jsonBody, init);
	}
}

/**
 * Returns a JSON response sending an ephemeral error message
 * @param {string} message - The message to send
 * @returns {JsonResponse} An ephemeral message with the given message
 */
export const errorMessage = (message: string = "Sorry! There's been an error") =>
	new JsonResponse({
		type: InteractionResponseType.ChannelMessageWithSource,
		data: { content: message, flags: MessageFlags.Ephemeral }
	});
