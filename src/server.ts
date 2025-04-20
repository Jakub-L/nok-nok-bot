import { AutoRouter } from 'itty-router';
import { verifyKey } from 'discord-interactions';
import { JsonResponse } from './utils';
import { handlerLookup } from './commands';

import { InteractionType, InteractionResponseType, APIInteraction } from 'discord-api-types/v10';

// UTILS
/**
 * Checks if the request is a valid Discord interaction
 * @param {Request} request - Incoming request
 * @param {any} env - Environment variables
 * @returns {Promise<{ interaction: Interaction, isValid: boolean }>} - Returns the interaction and whether
 * 				the request is valid
 */
async function verifyDiscordRequest(request: Request, env: any) {
	const signature = request.headers.get('x-signature-ed25519');
	const timestamp = request.headers.get('x-signature-timestamp');
	const body = await request.text();
	const isValidRequest =
		signature && timestamp && (await verifyKey(body, signature, timestamp, env.DISCORD_PUBLIC_KEY));
	if (!isValidRequest) return { isValid: false };
	return { interaction: JSON.parse(body) as APIInteraction, isValid: true };
}

// ROUTING
const router = AutoRouter();

/** Basic route to see worker is active */
router.get(
	'/',
	(_, env: any) => new Response(`Running Discord application ID: ${env.DISCORD_APPLICATION_ID}`)
);

/** Discord interaction endpoint */
router.post('/', async (req: Request, env: any) => {
	const { isValid, interaction } = await verifyDiscordRequest(req, env);
	if (!isValid || !interaction) return new Response('Bad request signature.', { status: 401 });

	if (interaction.type === InteractionType.Ping) {
		return new JsonResponse({
			type: InteractionResponseType.Pong
		});
	} else if (interaction.type === InteractionType.ApplicationCommand) {
		const commandName = interaction.data.name.toLowerCase();
		if (commandName in handlerLookup) return await handlerLookup[commandName](interaction, env);
		else return new JsonResponse({ error: 'Unknown Command' }, { status: 400 });
	} else return new JsonResponse({ error: 'Unknown Type' }, { status: 400 });
});

/** All other routes return 404 */
router.all('*', () => new Response('Not Found', { status: 404 }));

export const server = {
	fetch: router.fetch
};
