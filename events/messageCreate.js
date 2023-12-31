require("dotenv").config();
const { client, database } = require("../");
const cfg_karmaMessageLength = process.env.KARMA_MSG_LENGTH;

function insertUser(insertData) {
	database.query("INSERT INTO users SET ?", insertData, (err) => {
		if(err) {
			console.error("Error executing query: ", err);
			return;
		}
		console.log(`New user ${insertData.userid} inserted.`);
	})
}

function updateKarma(newkarma, findUser) {
	database.query(`UPDATE users SET karma=${newkarma} WHERE userid=${findUser}`, (err) => {
		if(err) {
			console.error("Error executing query: ", err);
			return;
		}
		console.log(`User ${findUser} updated.`);
	});
}

function insertChannel(insertData) {
	database.query("INSERT INTO channels SET ?", insertData, (err) => {
		if(err) {
			console.error("Error executing query: ", err);
			return;
		}
		console.log(`New channel ${insertData.channelid} inserted.`);
	})
}

function updateChannelMsg(newmsg, findChannel) {
	database.query(`UPDATE channels SET messages=${newmsg} WHERE channelid=${findChannel}`, (err) => {
		if(err) {
			console.error("Error executing query: ", err);
			return;
		}
		console.log(`Channel ${findChannel} updated.`);
	});
}

client.on("messageCreate", (message) => {
	// Bot self-protection
	if(message.author.bot)
		return;

	// Twitter detection
	const twitterRegex = /https:\/\/twitter\.com\/\S+\/status\/\d+/;
	if(twitterRegex.test(message.content)) {
		if(message.content.includes("fxtwitter.com") || message.content.includes("vxtwitter.com"))
			return;
		let twitterPostLink = message.content.match(twitterRegex)[0];
		twitterPostLink = twitterPostLink.replace("twitter.com/", "fxtwitter.com/");
		message.reply(`I have fixed the Twitter for you: ${twitterPostLink}`);
	}
	
	// X detection
	const xcomRegex = /https:\/\/x\.com\/\S+\/status\/\d+/;
	if(xcomRegex.test(message.content)) {
		if(message.content.includes("fxtwitter.com") || message.content.includes("vxtwitter.com"))
			return;
		let xcomPostLink = message.content.match(xcomRegex)[0];
		xcomPostLink = xcomPostLink.replace("x.com/", "fxtwitter.com/");
		message.reply(`I have fixed the X for you: ${xcomPostLink}`);
	}

	// Instagram detection
	const instagramRegex = /(https?:\/\/)?(www\.)?instagram\.com\/(?:p|reel|reels)\/([a-zA-Z0-9_-]+)/;
	if(instagramRegex.test(message.content)) {
		if(message.content.includes("ddinstagram.com"))
			return;
		let instagramPostLink = message.content.match(instagramRegex)[0];
		instagramPostLink = instagramPostLink.replace("instagram.com/", "ddinstagram.com/");
		message.reply(`I have fixed the Instagram for you: ${instagramPostLink}`);
	}

	// Reddit detection
	// const redditRegex = /^https?:\/\/(?:www\.)?reddit\.com\/r\/[^\/]+\/comments\/[a-z0-9]+\/[^\/]+\/?$/i;
	const redditRegex = /^https?:\/\/(?:www\.)?reddit\.com\/r\/[^\/]+\/comments\/[a-z0-9]+\/[^\/]+\/?(?:\?.*)?$/i;
	if(redditRegex.test(message.content)) {
		if(message.content.includes("rxddit.com"))
			return;
		let redditPostLink = message.content.match(redditRegex)[0];
		redditPostLink = redditPostLink.replace("reddit.com/", "rxddit.com/");
		message.reply(`I have fixed the Reddit for you: ${redditPostLink}`);
	}

	// Message Counter // Detect messages longer than 5 chars
	if(message.content.length >= cfg_karmaMessageLength) {
		let karmaMsg = message.content;
		karmaMsg = karmaMsg.replace(/<:.+?:\d+>/gi, ""); // remove emojis/gifs?
		karmaMsg = karmaMsg.replace(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi, ""); // remove URLs?
		karmaMsg = karmaMsg.replace("https://", "");
		karmaMsg = karmaMsg.replace("http://", "");
		karmaMsg = karmaMsg.replace(/ /g, ""); // remove spacebars

		if(karmaMsg.length < cfg_karmaMessageLength)
			return;

		// message is ok, write to DB
		const userid = message.author.id;
		const findUser = {userid: userid};
		
		database.promise().query("SELECT * FROM users WHERE ?", findUser)
		.then(([result]) => {
			if(result.length > 0) {
				// user in DB
				const newKarma = (result[0].karma) + 1;
				updateKarma(newKarma, findUser.userid);
			} else {
				// user not in DB
				message.guild.members.fetch(userid)
				.then((member) => {
					const newUser = {
						username: member.user.username,
						userid: member.id,
						joinedGuild: member.joinedAt,
						karma: 1,
					};
					insertUser(newUser);
				})
				.catch(console.error);
			}
		})
		.catch(console.error);

		// write channel statistics
		const channelid = message.channelId;
		const findChannel = {channelid: channelid};

		database.promise().query("SELECT * FROM channels WHERE ?", findChannel)
		.then(([result]) => {
			if(result.length > 0) {
				// channel in DB
				const newMessages = (result[0].messages) + 1;
				updateChannelMsg(newMessages, findChannel.channelid);
			} else {
				// channel not in DB
				const newChannel = {
					name: message.channel.name,
					channelid: channelid,
					messages: 1,
				};
				insertChannel(newChannel);
			}
		})
		.catch(console.error);

		return;
	};
});