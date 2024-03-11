const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const {client} = require("../");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('time')
		.setDescription('Returns a UK time because Pichliac must be different.')
		.addNumberOption(option => 
			option.setName("hour").setDescription("Enter hour (0-23)").setRequired(true))
		.addNumberOption(option => 
			option.setName("minute").setDescription("Enter minute (0-59)").setRequired(false)),
	async execute(interaction) {
		const inputHour = interaction.options.getNumber("hour");
		let inputMinute = interaction.options.getNumber("minute");

		// Hour number Guard
		if(inputHour < 0 || inputHour > 23) {
			interaction.reply(`Invalid hour! (0-23) => entered ${inputHour}`);
			return;
		}

		// Minute number Guard
		if(inputMinute < 0 || inputMinute > 59)
			inputMinute = 0;

		// Lib init
		let date = new Date();
		date.setHours(inputHour);
		date.setMinutes(inputMinute);

		// Timezones
		const sourceTZ = "Europe/Bratislava";
		const targetTZ = "Europe/Dublin";

		const sourceTime = date.toLocaleString('sk-SK', {
			timeZone: sourceTZ,
			hour12: false,
			hour: 'numeric',
			minute: 'numeric'
		});

		const targetTime = date.toLocaleString('sk-SK', {
			timeZone: targetTZ,
			hour12: false,
			hour: 'numeric',
			minute: 'numeric'
		});

		const timeEmbed = new EmbedBuilder()
			.setColor(0xFF0000)
			.setTitle(`Converting time to Pichliac's timezone...`)
			.addFields(
				{ name: "CZ/SK Time", value: `${sourceTime}`, inline: true },
				{ name: "Pichliac Time", value: `${targetTime}`, inline: true },
			)
			.setTimestamp();

		interaction.reply({ embeds: [timeEmbed] });
		return;
	},
};