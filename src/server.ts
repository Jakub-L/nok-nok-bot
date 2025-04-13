import { AutoRouter } from 'itty-router';
import { InteractionResponseType, InteractionType, verifyKey } from 'discord-interactions';

// UTILS
/** JSON Response to a request */
class JsonResponse extends Response {
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
 * Checks if the request is a valid Discord interaction
 * @param {Request} request - Incoming request
 * @param {any} env - Environment variables
 * @returns {Promise<{ interaction: any, isValid: boolean }>} - Returns the interaction and whether
 * 				the request is valid
 */
async function verifyDiscordRequest(request: Request, env: any) {
	const signature = request.headers.get('x-signature-ed25519');
	const timestamp = request.headers.get('x-signature-timestamp');
	const body = await request.text();
	const isValidRequest =
		signature && timestamp && (await verifyKey(body, signature, timestamp, env.DISCORD_PUBLIC_KEY));
	if (!isValidRequest) return { isValid: false };
	return { interaction: JSON.parse(body), isValid: true };
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

	if (interaction.type === InteractionType.PING) {
		return new JsonResponse({
			type: InteractionResponseType.PONG
		});
	} else if (interaction.type === InteractionType.APPLICATION_COMMAND) {
		return new JsonResponse({
			type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
			data: { content: 'Hello World!' }
		});
	} else return new JsonResponse({ error: 'Unknown Type' }, { status: 400 });
});

/** All other routes return 404 */
router.all('*', () => new Response('Not Found', { status: 404 }));

export const server = {
	fetch: router.fetch
};
