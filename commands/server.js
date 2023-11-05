const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const client = require("../");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('serverinfo')
		.setDescription('Server info')
		.setDefaultMemberPermissions(0),
	async execute(interaction) {
		const serverInfo = await interaction.guild.fetch();
		
		const serverEmbed = new EmbedBuilder()
			.setColor(0xFF0000)
			.setTitle(`${serverInfo.name} - Server Information`)
			.addFields(
				{ name: "Members", value: `${serverInfo.memberCount}`, inline: true },
				{ name: "Server Boost", value: `Level ${serverInfo.premiumTier}`, inline: true },
				{ name: "Created", value: `${(interaction.guild.createdAt)}` }
			)
			.setTimestamp()

		interaction.reply({ embeds: [serverEmbed] });
	},
};