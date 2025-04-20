import type { JsonResponse } from './json-response';
import { APIApplicationCommandOption } from 'discord-api-types/v10';

export type InteractionHandler = (interaction: Record<string, any>) => JsonResponse;
export type Command = {
	name: string;
	description: string;
	options?: APIApplicationCommandOption[];
	handler: InteractionHandler;
};
