import { REST, Routes } from 'discord.js';

import 'dotenv/config';
import { commands } from '../src/commands';

const { DISCORD_CLIENT_ID = '', TARGET_SERVER_ID = '', DISCORD_TOKEN = '' } = process.env;

const commandData = commands.map((command) => command.data.toJSON());
const rest = new REST().setToken(DISCORD_TOKEN);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);
		const data: any = await rest.put(
			Routes.applicationGuildCommands(DISCORD_CLIENT_ID, TARGET_SERVER_ID),
			{
				body: commandData
			}
		);
		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();
