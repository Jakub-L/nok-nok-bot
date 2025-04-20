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
