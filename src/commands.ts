import {
	InteractionResponseType,
	APIApplicationCommandInteractionDataStringOption,
	MessageFlags,
	APIMessage
} from 'discord-api-types/v10';

import type { Command, InteractionHandler } from './utils/types';
import {
	convertToBlockquote,
	errorMessage,
	getOptionValue,
	isDateInPast,
	JsonResponse,
	randomSelect
} from './utils';
import { didYouKnow, gameCancelled, gameHappening, greetings } from './data';

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
		const { DISCORD_TOKEN, DISCORD_CHANNEL_ID, DISCORD_APPLICATION_ID } = env;

		const ipAddress = options.find(
			(option: APIApplicationCommandInteractionDataStringOption) => option.name === 'ip_address'
		)?.value;
		if (!ipAddress) return errorMessage('IP address is required!');

		// Fetch the last messages and delete any previous server messages
		const channelMessages = await fetch(
			`https://discord.com/api/v10/channels/${DISCORD_CHANNEL_ID}/messages?limit=100`,
			{
				headers: {
					Authorization: `Bot ${DISCORD_TOKEN}`
				}
			}
		);
		const messageHistory = await channelMessages.json();
		const previousServerMessageIds = messageHistory
			.filter(
				(message: APIMessage) =>
					message.author.id === DISCORD_APPLICATION_ID &&
					message.content.endsWith('server message.') &&
					new Date(message.timestamp) > new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
			)
			.map((message: APIMessage) => message.id);

		const r = await fetch(
			`https://discord.com/api/v10/channels/${DISCORD_CHANNEL_ID}/messages/bulk-delete`,
			{
				method: 'POST',
				body: JSON.stringify({ messages: previousServerMessageIds }),
				headers: { Authorization: `Bot ${DISCORD_TOKEN}`, 'Content-Type': 'application/json' }
			}
		);

		const time = '30 minutes';

		return new JsonResponse({
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				content: `The server is up!\n${ipAddress}\nSee you in ${time}!\n-# Beep boop! I am a bot. This is a server message.`
			}
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
		},
		{
			type: 4,
			name: 'game_weekday_override',
			description: 'Override the game weekday. 0 = Sunday, 1 = Monday, etc.',
			min_value: 0,
			max_value: 6
		}
	],
	default_member_permissions: '8',
	handler: async ({ data = {} }, env) => {
		const { options = [] } = data;
		const { GAME_WEEKDAY, NOK_NOK_BOT } = env;

		const today = new Date();
		const gameWeekday = getOptionValue(options, 'game_weekday_override') ?? Number(GAME_WEEKDAY);
		if (today.getDay() !== gameWeekday) return errorMessage("It's not a game day today!");

		const cancelledGames = JSON.parse(await NOK_NOK_BOT.get('cancelled_games')) ?? [];
		const isCancelled: boolean = cancelledGames.includes(today.toISOString().split('T')[0]);

		const customMessage = getOptionValue(options, 'custom_message');
		const greeting = randomSelect(greetings);
		const reminder = randomSelect(isCancelled ? gameCancelled : gameHappening);
		const fact = randomSelect(didYouKnow);

		const content = [
			`${greeting} ${reminder}`,
			customMessage && `Jakub also left a custom message:\n${convertToBlockquote(customMessage)}`,
			`**Did you know?**\n${convertToBlockquote(fact)}\n-# Beep boop! I am a bot. This is a reminder message.`
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
		},
		{
			type: 4,
			name: 'game_weekday_override',
			description: 'Override the game weekday. 0 = Sunday, 1 = Monday, etc.',
			min_value: 0,
			max_value: 6
		}
	],
	default_member_permissions: '8',
	handler: async ({ data = {} }, env) => {
		const { options = [] } = data;
		const { GAME_WEEKDAY, NOK_NOK_BOT } = env;

		const gameWeekday =
			getOptionValue(options, 'game_weekday_override') ?? parseInt(GAME_WEEKDAY, 10);
		const date = new Date(getOptionValue(options, 'date'));

		if (isNaN(date.getTime())) return errorMessage('Invalid date format!');
		if (isDateInPast(date)) return errorMessage('Date is in the past!');
		if (date.getDay() !== gameWeekday) return errorMessage('Date is not a game day!');

		const cancelledGames = JSON.parse(await NOK_NOK_BOT.get('cancelled_games')) ?? [];
		const newCancelledGames = cancelledGames
			.filter((date: string) => !isDateInPast(new Date(date)))
			.concat([date.toISOString().split('T')[0]])
			.reduce((set: Set<string>, date: string) => set.add(date), new Set());
		await NOK_NOK_BOT.put('cancelled_games', JSON.stringify([...newCancelledGames.values()]));

		return new JsonResponse({
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				content: `Marked game on ${date.toLocaleDateString('en-GB')} as cancelled`,
				flags: MessageFlags.Ephemeral
			}
		});
	}
};

const RESTORE_GAME: Command = {
	name: 'restore',
	description: 'Remove a date from the list of future cancelled games',
	options: [
		{
			type: 3,
			name: 'date',
			description: 'The date of the cancelled game.',
			required: true
		}
	],
	default_member_permissions: '8',
	handler: async ({ data = {} }, env) => {
		const { options = [] } = data;
		const { NOK_NOK_BOT } = env;

		const date = getOptionValue(options, 'date');

		const cancelledGames = JSON.parse(await NOK_NOK_BOT.get('cancelled_games')) ?? [];
		const newCancelledGames = cancelledGames
			.filter((date: string) => !isDateInPast(new Date(date)))
			.filter((cancelledGame: string) => date !== cancelledGame);
		await NOK_NOK_BOT.put('cancelled_games', JSON.stringify(newCancelledGames));

		return new JsonResponse({
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				content: `Marked game on ${new Date(date).toLocaleDateString('en-GB')} as restored`,
				flags: MessageFlags.Ephemeral
			}
		});
	}
};

const commands = [SET_SERVER, REMINDER, CANCEL_GAME, RESTORE_GAME];

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
