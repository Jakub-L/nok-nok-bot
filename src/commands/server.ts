import { SlashCommandBuilder } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';

export const server = {
	data: new SlashCommandBuilder().setName('server').setDescription('Sets server IP'),
	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.reply({ content: 'I got your request' });
	}
};
