const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const {client, database} = require("../");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('karmaboard')
		.setDescription('Display Server Karmaboard'),
	async execute(interaction) {
		database.promise().query("SELECT userid, karma FROM users")
		.then(([result]) => {
			if(result.length > 0) {
				// user in DB
				const leaderbord = result;
				leaderbord.sort((a, b) => b.karma - a.karma);
				let leaderbordString = "";
				leaderbord.forEach((user, index) => {
					leaderbordString = leaderbordString + `\n#${index+1} | <@${user.userid}> | Karma: ${user.karma}`;
				})

				const leaderboardEmbed = new EmbedBuilder()
					.setColor(0xFF0000)
					.setTitle(`Server Karmaboard`)
					.setDescription(leaderbordString)
					.setTimestamp()
				interaction.reply({ embeds: [leaderboardEmbed] });
				return;
			} else {
				interaction.reply("Karmaboard is empty.");
				return;
			}
		})
	},
};