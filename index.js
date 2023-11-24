require("dotenv").config();
const path = require("path");
const fs = require("fs");
const { Client, Collection,  Events, GatewayIntentBits, Message, REST, Routes } = require("discord.js");
const mysql = require("mysql2");

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages,GatewayIntentBits.GuildMembers,GatewayIntentBits.MessageContent,] });

// Log in to Discord with your client's token
client.login(process.env.BOT_TOKEN);

// Command Indexing
client.commands = new Collection();
const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// connect to DB
const database = mysql.createPool({
	host: "127.0.0.1",
	user: "ap4che",
	password: "discordbot",
	database: "pelerditutti",
	waitForConnections: true,
	connectionLimit: 5,
	queueLimit: 0
});
// const database = mysql.createPool({
// 	host: "127.0.0.1",
// 	user: "root",
// 	password: "",
// 	database: "pelerditutti",
// 	waitForConnections: true,
// 	connectionLimit: 5,
// 	queueLimit: 0
// });

database.on("connection", (connection) => {
	console.log("Connected to DB.");
	connection.on("error", (err) => {
		console.error("DB Connection error: ", err.code);
	});
	connection.on("close", () => {
		console.log("DB Connection closed.");
	});
})
module.exports = {client, database};

for(const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
		commands.push(command.data.toJSON());
		console.log(`Command found: ${command.data.name}`);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

// Command Registration
const rest = new REST().setToken(process.env.BOT_TOKEN);
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();

// ********* //
// BOT READY //
// ********* //

// load event triggers handlers
["ready", "messageCreate", "interactionCreate"].forEach((eventTrigger) => {
	require(`./events/${eventTrigger}`);
});