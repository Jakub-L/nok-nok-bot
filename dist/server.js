import { AutoRouter } from 'itty-router';
import { InteractionResponseType, InteractionType, verifyKey } from 'discord-interactions';
class JsonResponse extends Response {
    constructor(body, init = {
        headers: {
            'content-type': 'application/json;charset=UTF-8'
        }
    }) {
        const jsonBody = JSON.stringify(body);
        super(jsonBody, init);
    }
}
async function verifyDiscordRequest(request, env) {
    const signature = request.headers.get('x-signature-ed25519');
    const timestamp = request.headers.get('x-signature-timestamp');
    const body = await request.text();
    const isValidRequest = signature && timestamp && (await verifyKey(body, signature, timestamp, env.DISCORD_PUBLIC_KEY));
    if (!isValidRequest)
        return { isValid: false };
    return { interaction: JSON.parse(body), isValid: true };
}
const router = AutoRouter();
router.get('/', (_, env) => new Response(`Running Discord application ID: ${env.DISCORD_APPLICATION_ID}`));
router.post('/', async (req, env) => {
    const { isValid, interaction } = await verifyDiscordRequest(req, env);
    if (!isValid || !interaction)
        return new Response('Bad request signature.', { status: 401 });
    if (interaction.type === InteractionType.PING) {
        return new JsonResponse({
            type: InteractionResponseType.PONG
        });
    }
    else if (interaction.type === InteractionType.APPLICATION_COMMAND) {
        return new JsonResponse({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: 'Hello World!' }
        });
    }
    else
        return new JsonResponse({ error: 'Unknown Type' }, { status: 400 });
});
router.all('*', () => new Response('Not Found', { status: 404 }));
export const server = {
    fetch: router.fetch
};
