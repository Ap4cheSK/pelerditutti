const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const {client, database} = require("../");
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
		const have_currency = (interaction.options.getString("have_currency")).toUpperCase();
		const want_currency = (interaction.options.getString("want_currency")).toUpperCase();
		const ammount = interaction.options.getNumber("ammount");

		request.get({
			url: `https://api.currencyapi.com/v3/latest?apikey=cur_live_lsHsMB390Rt5mzQJHOH2UGD9fHjpot7mNrt0r0iX&currencies=${want_currency}&base_currency=${have_currency}`,
		}, function(error, response, body) {
			if(error) return console.error('Request failed:', error);
			else if(response.statusCode != 200) {
				interaction.reply('Error:', response.statusCode, body.toString('utf8'));
				return console.error('Error:', response.statusCode, body.toString('utf8'));
			} else {
				const api = JSON.parse(body);
				const conversions = Object.values(api.data);
				const conversion_rate = conversions[0].value;
				const new_price = Math.round((ammount * conversion_rate) * 100) / 100;
				interaction.reply(`${ammount} ${have_currency} = ${new_price} ${want_currency}`);
			}
		});
	},
};