const { MessageManager, TextChannel, EmbedBuilder } = require("discord.js");
const { client, database } = require("../");
const cron = require("node-cron");
const fs = require("fs");
require("dotenv").config();

client.once("ready", () => {
	client.user.setStatus("online");
	console.log("\nBot Ready!\n=========");

	const guild = client.guilds.cache.get(process.env.GUILD_ID);
	const channel = guild.channels.cache.get(process.env.CHAT_ID); //CHAT CHANNEL

	cron.schedule("0 0 7 * * *", () => {
		// ************ //
		// Dobre rejnou //
		// ************ //
		channel.send("https://cdn.discordapp.com/attachments/1033122941719822377/1138344315966464030/dobre_rejnou.mp4");

	});

	// ******** //
	// Kalendár //
	// ******** //

	function daysSince(dateString) {
		const startDate = new Date(dateString);
		const currentDate = new Date();
		const days = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24));
		return days;
	}

	const weekdays = ["Nedeľa", "Pondelok", "Utorok", "Streda", "Štvrtok", "Piatok", "Sobota"];
	const months = ["Január", "Február", "Marec", "Apríl", "Máj", "Jún", "Júl", "August", "September", "Október", "November", "December"];
	
	// get dates
	let date = new Date();
	const weekday = date.getDay(); // 0-6 (sunday-saturday)
	const day = date.getDate(); // 1-31
	const month = date.getMonth(); // 0-11 (januar-december)
	const year = date.getFullYear();
	const odpadliciSince = "2024-03-07" // 7th March 2024
	const odpadliciCounter = daysSince(odpadliciSince);

	fs.readFile("./data/namedays.json", "utf-8", (err, data) => {
		if(err) {
			console.error("Error reading file:", err);
			return;
		}

		try {
			const nameDayData = JSON.parse(data);
			const nameday = nameDayData[`${month}`][`${day}`];

			const timeEmbed = new EmbedBuilder()
				.setColor(0xFF0000)
				.setTitle(`${weekdays[weekday]} ${day}. ${months[month]} ${year}`)
				.setDescription("Vítaj v novom dni!")
				.addFields(
					{ name: "Meniny", value: `${nameday}`, inline: false },
					{ name: "Odpadlíkmi už", value: `${odpadliciCounter} dní`, inline: false },
				)
				.setTimestamp();

			timeEmbed.setImage("https://hips.hearstapps.com/hmg-prod/images/beautiful-sunrise-dolomites-belluno-provence-italy-1492545669.jpg");

			if(month <= 2 || month >= 10)
				timeEmbed.setImage("https://upload.wikimedia.org/wikipedia/commons/1/1a/Winter_sunrise_on_the_way_to_Vi%C5%A1evnik_mountain.jpg");

			channel.send({ embeds: [timeEmbed] });
		} catch(error) {
			console.error("Error passing JSON:", error);
			channel.send("Failed to send calendar today.");
			return;
		}
	});

	return;
});