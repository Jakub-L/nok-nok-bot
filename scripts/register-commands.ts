import { commands } from '../src/commands';
import dotenv from 'dotenv';

// CONFIG
dotenv.config({ path: '.dev.vars' });
const { DISCORD_TOKEN, DISCORD_APPLICATION_ID } = process.env;
if (!DISCORD_TOKEN) throw new Error('DISCORD_TOKEN is not defined');
if (!DISCORD_APPLICATION_ID) throw new Error('DISCORD_APPLICATION_ID is not defined');

// REGISTER COMMANDS
const url = `https://discord.com/api/v10/applications/${DISCORD_APPLICATION_ID}/commands`;

const response = await fetch(url, {
	method: 'PUT',
	headers: {
		'Content-Type': 'application/json',
		Authorization: `Bot ${DISCORD_TOKEN}`
	},
	body: JSON.stringify(commands)
});

if (response.ok) {
	const data = await response.json();
	console.log('Registered all commands');
	console.log(JSON.stringify(data, null, 2));
} else {
	console.error('Error registering commands');
	console.error(`${response.url}: ${response.status} ${response.statusText}`);
	const error = await response.text();
	if (error) console.error(error);
}
