const client = require("../");
const cron = require("node-cron");

client.once("ready", () => {
	const activities = [
		{ name: `${client.users.cache.size} Uživatelů`, type: 3 }, // WATCHING
	];

	client.user.setActivity(activities[0]);
	client.user.setStatus("online");
	console.log("\nBot Ready!\n=========");

	// ************ //
	// DOBRE REJNOU //
	// ************ //
	cron.schedule("0 0 8 * * *", () => {
		const guild = client.guilds.cache.get(process.env.GUILD_ID);
		const channel = guild.channels.cache.get(process.env.CHAT_ID);
		channel.send("https://cdn.discordapp.com/attachments/1033122941719822377/1138344315966464030/dobre_rejnou.mp4");
	});
});