import { InteractionResponseType } from 'discord-interactions';

import type { Command, InteractionHandler } from './utils/types';
import { JsonResponse } from './utils/json-response';

const SET_SERVER: Command = {
	name: 'server',
	description:
		'Post the current Foundry server IP address and remove previous links to prevent confusion.',
	handler: () =>
		new JsonResponse({
			type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
			data: { content: 'Used /server command!' }
		})
};

const REMINDER: Command = {
	name: 'reminder',
	description:
		'Posts a game reminder, letting the players know whether there is a game today or not.',
	handler: () =>
		new JsonResponse({
			type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
			data: { content: 'Used /reminder command' }
		})
};

const commands = [SET_SERVER, REMINDER];

export const registerableCommands = commands.map(({ name, description }) => ({
	name,
	description
}));

export const handlerLookup: Record<string, InteractionHandler> = commands.reduce(
	(acc, { name, handler }) => ({ ...acc, [name]: handler }),
	{} as Record<string, InteractionHandler>
);
