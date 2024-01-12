const { SlashCommandBuilder } = require("discord.js");
const { client, database } = require("../");
require("dotenv").config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setbitrate')
		.setDescription('Sets Voice channels bitrate to max allowed value.')
		.setDefaultMemberPermissions(0),
	async execute(interaction) {
		try {
			const guild = interaction.guild;
			const maxBitrate = guild.maximumBitrate;
			
			guild.channels.fetch()
				.then(channels => {
					channels.forEach(channel => {
						if(channel.type === 2) {
							if(channel.bitrate !== maxBitrate) {
								channel.edit({ bitrate: maxBitrate });
								console.log(`Channel ${channel.name} bitrate maximized!`);
							} else {
								console.log(`Channel ${channel.name} has maximum bitrate!`);
							}
						}
					})
				});
			interaction.reply("Channels' bitrate maximized.");
			return;
		} catch(err) {
			interaction.reply("Failed to maximize bitrates.");
			console.log(err);
		}
	},
};