import {
	InteractionResponseType,
	APIApplicationCommandInteractionDataStringOption
} from 'discord-api-types/v10';

import type { Command, InteractionHandler } from './utils/types';
import { JsonResponse, randomSelect, convertToBlockquote } from './utils';
import { didYouKnow, gameHappening, greetings } from './data';

const SET_SERVER: Command = {
	name: 'server',
	description:
		'Post the current Foundry server IP address and remove previous links to prevent confusion.',
	default_member_permissions: '8',
	handler: async ({ data = {} }, env) => {
		return new JsonResponse({
			type: InteractionResponseType.ChannelMessageWithSource,
			data: { content: 'Used /server command!' }
		});
	}
};

const REMINDER: Command = {
	name: 'reminder',
	description:
		'Posts a game reminder, letting the players know whether there is a game today or not.',
	options: [
		{
			type: 3,
			name: 'custom_message',
			description: 'A custom message to include in the reminder.'
		}
	],
	default_member_permissions: '8',
	handler: async ({ data = {} }) => {
		const { options = [] } = data;

		const customMessage = options.find(
			(option: APIApplicationCommandInteractionDataStringOption) => option.name === 'custom_message'
		)?.value;
		const greeting = randomSelect(greetings);
		const reminder = randomSelect(gameHappening);
		const fact = randomSelect(didYouKnow);

		const content = [
			`### ${greeting} ${reminder}`,
			customMessage && `Jakub also left a custom message:\n${convertToBlockquote(customMessage)}`,
			`**Did you know?**\n${convertToBlockquote(fact)}`,
			`-# Beep boop! I am a bot.`
		]
			.filter((x) => x)
			.join('\n\n');

		return new JsonResponse({
			type: InteractionResponseType.ChannelMessageWithSource,
			data: { content }
		});
	}
};

const commands = [SET_SERVER, REMINDER];

export const registerableCommands = commands.map((command) => ({
	name: command.name,
	description: command.description,
	options: command.options
}));

export const handlerLookup: Record<string, InteractionHandler> = commands.reduce(
	(acc, { name, handler }) => ({ ...acc, [name]: handler }),
	{} as Record<string, InteractionHandler>
);
