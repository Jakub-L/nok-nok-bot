import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
import type { TextChannel } from 'discord.js';

import 'dotenv/config';
import { commands } from './commands';

const { DISCORD_TOKEN = '', TARGET_CHANNEL_ID = '' } = process.env;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();
commands.forEach((command) => client.commands.set(command.data.name, command));

client.once(Events.ClientReady, (readyClient) => {
	console.log(`[${new Date().toISOString()}] ${readyClient.user?.username} is ready!`);
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;
	console.log(`[${new Date().toISOString()}] Received command: ${interaction.commandName}`);
	const command = interaction.client.commands.get(interaction.commandName);
	if (!command) return;
	await command.execute(interaction);
});

client.login(DISCORD_TOKEN);
