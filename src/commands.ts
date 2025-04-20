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
	options: [
		{
			type: 3,
			name: 'ip_address',
			description: 'The IP address of the Foundry server.',
			required: true
		}
	],
	default_member_permissions: '8',
	handler: async ({ data = {} }, env) => {
		const { options = [] } = data;
		const { NOK_NOK_BOT } = env;

		const ipAddress = options.find(
			(option: APIApplicationCommandInteractionDataStringOption) => option.name === 'ip_address'
		)?.value;

		await NOK_NOK_BOT.put('server_ip', ipAddress);

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

const CANCEL_GAME: Command = {
	name: 'cancel',
	description: 'Add a date to the list of future cancelled games',
	options: [
		{
			type: 3,
			name: 'date',
			description: 'The date of the cancelled game.',
			required: true
		}
	],
	default_member_permissions: '8',
	handler: async () => {
		return new JsonResponse({
			type: InteractionResponseType.ChannelMessageWithSource,
			data: { content: '' }
		});
	}
};

const commands = [SET_SERVER, REMINDER, CANCEL_GAME];

export const registerableCommands = commands.map((command) => ({
	name: command.name,
	description: command.description,
	options: command.options,
	default_member_permissions: command.default_member_permissions
}));

export const handlerLookup: Record<string, InteractionHandler> = commands.reduce(
	(acc, { name, handler }) => ({ ...acc, [name]: handler }),
	{} as Record<string, InteractionHandler>
);
