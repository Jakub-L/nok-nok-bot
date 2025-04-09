import { Client, Events, GatewayIntentBits } from 'discord.js';
import type { TextChannel } from 'discord.js';
import 'dotenv/config';

const { DISCORD_TOKEN = '', TARGET_CHANNEL_ID = '' } = process.env;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (readyClient) => {
	(client.channels.cache.get(TARGET_CHANNEL_ID) as TextChannel).send(Date.now().toLocaleString());
});

client.login(DISCORD_TOKEN);
