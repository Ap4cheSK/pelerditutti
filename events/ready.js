const client = require("../");

client.once("ready", () => {
	const activities = [
		{ name: `${client.users.cache.size} Uživatelů`, type: 3 }, // WATCHING
	];

	client.user.setActivity(activities[0]);
	client.user.setStatus("online");

	console.log("\nBot Ready!\n=========");
});