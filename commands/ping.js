const { SlashCommandBuilder } = require("discord.js");
const client = require("../");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Ping to discord API'),
	async execute(interaction) {
		await interaction.reply(`Ping to Discord API: ${client.ws.ping}ms`);
	},
};