const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const {client, database} = require("../");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('channelkarma')
		.setDescription('Display Channels Karma'),
	async execute(interaction) {
		database.promise().query("SELECT channelid, messages FROM channels")
		.then(([result]) => {
			if(result.length > 0) {
				// channel in DB
				const leaderbord = result;
				leaderbord.sort((a, b) => b.messages - a.messages);
				let leaderbordString = "";
				leaderbord.forEach((channel, index) => {
					leaderbordString = leaderbordString + `\n#${index+1} | <#${channel.channelid}> | Karma: ${channel.messages}`;
				})

				const leaderboardEmbed = new EmbedBuilder()
					.setColor(0xFF0000)
					.setTitle(`Channels Karmaboard`)
					.setDescription(leaderbordString)
					.setTimestamp()
				interaction.reply({ embeds: [leaderboardEmbed] });
				return;
			} else {
				interaction.reply("Channels Karmaboard is empty.");
				return;
			}
		})
	},
};