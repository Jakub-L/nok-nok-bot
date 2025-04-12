import { AutoRouter } from 'itty-router';

class JsonResponse extends Response {
	constructor(body: any, init: Record<string, any>) {
		const jsonBody = JSON.stringify(body);
		super(
			jsonBody,
			init || {
				headers: {
					'content-type': 'application/json;charset=UTF-8'
				}
			}
		);
	}
}

const router = AutoRouter();

router.get('/', (_, env) => {
	console.log(env);
	return new Response(`👋 ${env.DISCORD_APPLICATION_ID}`);
});

export const server = {
	fetch: router.fetch
};
