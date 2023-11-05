const { Events } = require("discord.js");
const client = require("../");
const { time } = require("console");

function clock() {
	let date = new Date();
	let hours = date.getHours();
	let minutes = date.getMinutes();
	let seconds = date.getSeconds();

	if(hours < 10) hours = ("0" + hours).toString();
	if(minutes < 10) minutes = ("0" + minutes).toString();
	if(seconds < 10) seconds = ("0" + seconds).toString();

	return `${hours}:${minutes}:${seconds}`;
}

client.on(Events.InteractionCreate, async interaction => {
	if(!interaction.isChatInputCommand()) return;
	
	const command = interaction.client.commands.get(interaction.commandName);

	if(!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		console.log(`[${clock()}] User ${interaction.user.globalName} used command /${interaction.commandName}`);
		await command.execute(interaction);
	} catch(error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
})