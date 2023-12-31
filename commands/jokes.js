const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const {client, database} = require("../");
const request = require("request");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('jokes')
		.setDescription('Returns a count of random jokes.')
		.addNumberOption(option => 
			option.setName("count").setDescription("How many jokes you want? (1-10)").setRequired(false)),
	async execute(interaction) {
		let count = interaction.options.getNumber("count");
		if(count === null) count = 5;
		if(count > 10) count = 10;
		if(count < 1) count = 5;

		request.get({
			url: `https://api.api-ninjas.com/v1/jokes?limit=${count}`,
			headers: {
				'X-Api-Key': `${process.env.NINJA_KEY}`
			}
		}, function(error, response, body) {
			if(error) return console.error('Request failed:', error);
			else if(response.statusCode != 200) {
				interaction.reply('Error:', response.statusCode, body.toString('utf8'));
				return console.error('Error:', response.statusCode, body.toString('utf8'));
			} else {
				const api = JSON.parse(body);
				let replyMessage = "**=== Jokes ===**\n```";
				api.forEach(element => {
					replyMessage = replyMessage + "> " + (element.joke) + "\n"}
				);
				interaction.reply(replyMessage + "```");
			}
		});
	},
};