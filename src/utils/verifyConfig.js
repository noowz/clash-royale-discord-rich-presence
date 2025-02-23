const { auth, settings } = require("../config.json");
const { logErrorAndExit } = require("./utils.js");

const CLIENT_ID = "844279952387866674";

async function verifyConfig() {
	if (!auth.discord.rpc.client_id) {
		logErrorAndExit("No Discord Rich Presence client ID provided. Please update the 'client_id' field in the config file with your Discord Rich Presence client ID.");
	} else if (!auth.discord.rpc.client_id.match(/\d/)) {
		logErrorAndExit("The provided Discord Rich Presence client ID is invalid. Ensure the 'client_id' field in the config file contains a valid numeric ID.");
	} else if (!auth.discord.rpc.client_id.match(CLIENT_ID)) {
		logErrorAndExit(`The provided Discord Rich Presence client ID does not match the required client ID. Update the 'client_id' field in the config file to ${CLIENT_ID}.`);
	};

	if (!auth.clashroyale.api.token || auth.clashroyale.api.token.match(/YOUR API KEY$/i)) {
		logErrorAndExit("No Clash Royale API key provided. Please update the 'token' field in the config file with your Clash Royale API key.");
	};

	if (!settings.player.player_tag || settings.player.player_tag.match(/YOUR PLAYER TAG$/i)) {
		logErrorAndExit("No Clash Royale player tag provided. Please update the 'player_tag' field in the config file with your Clash Royale player tag.");
	};
};

module.exports = { verifyConfig };