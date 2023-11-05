const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const client = require("../");
const request = require("request");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('currency')
		.setDescription('Converts currencies to another currencies.')
		.addStringOption(option => 
			option.setName("have_currency").setDescription("Currency you have. (USD,EUR,...)").setRequired(true))
		.addStringOption(option => 
			option.setName("want_currency").setDescription("Currency you want. (USD,EUR,...)").setRequired(true))
		.addNumberOption(option => 
			option.setName("ammount").setDescription("Ammount of money.").setRequired(true)),
	async execute(interaction) {
		const have_currency = interaction.options.getString("have_currency");
		const want_currency = interaction.options.getString("want_currency");
		const ammount = interaction.options.getNumber("ammount");
		let api_response;

		request.get({
			url: `https://api.api-ninjas.com/v1/convertcurrency?want=${want_currency}&have=${have_currency}&amount=${ammount}`,
			headers: {
				'X-Api-Key': 'WJxlnead88cnCg6b8G+V0A==rq2ffPq0YG7VB4yX'
			}
		}, function(error, response, body) {
			if(error) return console.error('Request failed:', error);
			else if(response.statusCode != 200) {
				interaction.reply('Error:', response.statusCode, body.toString('utf8'));
				return console.error('Error:', response.statusCode, body.toString('utf8'));
			} else {
				const api = JSON.parse(body);
				const apiOldAmmount = (api.old_amount).toString();
				const apiOldCurr = api.old_currency;
				const apiNewAmmount = (api.new_amount).toString();
				const apiNewCurr = api.new_currency;
				interaction.reply(`${apiOldAmmount} ${apiOldCurr} = ${apiNewAmmount} ${apiNewCurr}`);
			}
		});
	},
};