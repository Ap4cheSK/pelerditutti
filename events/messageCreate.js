const client = require("../");

client.on("messageCreate", (message) => {
	// Bot self-protection
	if(message.author.bot) return;

	// Twitter detection
	const twitterRegex = /https:\/\/twitter\.com\/\S+\/status\/\d+/;
	if(twitterRegex.test(message.content)) {
		let twitterPostLink = message.content.match(twitterRegex)[0];
		twitterPostLink = twitterPostLink.replace("twitter.com/", "fxtwitter.com/");
		message.reply(`I have fixed the Twitter for you: ${twitterPostLink}`);
	}

	const instagramRegex = /^https:\/\/www\.instagram\.com\/reel\/[a-zA-Z0-9_-]+\/$/;
	if(instagramRegex.test(message.content)) {
		let instagramPostLink = message.content.match(instagramRegex)[0];
		instagramPostLink = instagramPostLink.replace("instagram.com/", "ddinstagram.com/");
		message.reply(`I have fixed the Instagram for you: ${instagramPostLink}`);
	}
});