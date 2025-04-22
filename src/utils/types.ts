import type { JsonResponse } from './response';
import { APIApplicationCommandOption } from 'discord-api-types/v10';

export type InteractionHandler = (
	interaction: Record<string, any>,
	env: any
) => Promise<JsonResponse>;
export type Command = {
	name: string;
	description: string;
	default_member_permissions?: string;
	options?: APIApplicationCommandOption[];
	handler: InteractionHandler;
};
