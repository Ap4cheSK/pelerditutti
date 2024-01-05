const { MessageManager, TextChannel } = require("discord.js");
const { client, database } = require("../");
const cron = require("node-cron");
require("dotenv").config();

client.once("ready", () => {
	client.user.setStatus("online");
	console.log("\nBot Ready!\n=========");

	const guild = client.guilds.cache.get(process.env.GUILD_ID);
	const channel = guild.channels.cache.get(process.env.CHAT_ID); //CHAT CHANNEL
	// channel.send("https://cdn.discordapp.com/attachments/1033122941719822377/1138344315966464030/dobre_rejnou.mp4");

	// ************ //
	// DOBRE REJNOU //
	// ************ //
	cron.schedule("0 0 7 * * *", () => {
		channel.send("https://cdn.discordapp.com/attachments/1033122941719822377/1138344315966464030/dobre_rejnou.mp4");
	});

	// Fetch role msg and react
	// guild.channels.cache.get(process.env.ROLE_CHANNEL).messages.fetch(process.env.ROLE_MSG_ID)
	// 	.then((message) => {
	// 		["🇪","🇦","🇿","🇧","🇭","7️⃣","🇹","🇱"].forEach((item) => {
	// 			message.react(`${item}`);
	// 		});
	// 	});
});