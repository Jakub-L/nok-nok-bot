import { InteractionResponseType } from 'discord-api-types/v10';

import type { Command, InteractionHandler } from './utils/types';
import { JsonResponse, randomSelect, convertToBlockquote } from './utils';
import { didYouKnow, gameHappening, greetings } from './data';

const SET_SERVER: Command = {
	name: 'server',
	description:
		'Post the current Foundry server IP address and remove previous links to prevent confusion.',
	handler: () =>
		new JsonResponse({
			type: InteractionResponseType.ChannelMessageWithSource,
			data: { content: 'Used /server command!' }
		})
};

const REMINDER: Command = {
	name: 'reminder',
	description:
		'Posts a game reminder, letting the players know whether there is a game today or not.',
	handler: () => {
		const greeting = randomSelect(greetings);
		const reminder = randomSelect(gameHappening);
		const fact = randomSelect(didYouKnow);
		const customMessage = '';

		const content = [
			`### ${greeting} ${reminder}`,
			`Jakub also left a custom message:\n${convertToBlockquote(customMessage)}`,
			`**Did you know?**\n${convertToBlockquote(fact)}`,
			`-# Beep boop! I am a bot.`
		].join('\n\n');

		return new JsonResponse({
			type: InteractionResponseType.ChannelMessageWithSource,
			data: { content }
		});
	}
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
