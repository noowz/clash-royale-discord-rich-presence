const { name, version, repository } = require("../../package.json");
const { apis } = require("../config.json");
const { logger } = require("../utils/logger");
const axios = require("axios");
const { app } = require("google-play-scraper");

let firstTimeRunningRichPresence = true;

let startDate = firstTimeRunningRichPresence
	? Date.now()
	: startDate;

const rpc = async function setActivity(client) {
	const clashroyaleResponse = await axios({
		method: "GET",
		url: `${apis.clashroyale.base_url}/v1/players/%23${process.env.CLASH_ROYALE_PLAYER_TAG.replace("#", "")}`,
		headers: {
			"Authorization": `Bearer ${process.env.CLASH_ROYALE_API_KEY}`,
			"Content-Type": "application/json",
			"User-Agent": `${name}/${version}`
		}
	}).catch((error) => {
		logger.error(error);

		return;
	});

	const player = clashroyaleResponse.data;

	const gameApp = await app({
		appId: "com.supercell.clashroyale"
	});

	client.request("SET_ACTIVITY", {
		pid: process.pid,
		activity: {
			details: `⭐ Level: ${player.expLevel} • 🏆 Trophies: ${player.trophies}/${player.bestTrophies}`,
			state: `🛕 Arena: ${player.arena.name}`,
			timestamps: {
				start: startDate
			},
			assets: {
				large_image: gameApp.icon,
				large_text: gameApp.title,
				small_image: "player",
				small_text: `${player.name} (${player.tag})`
			},
			buttons: [
				{
					label: "🚀 Download",
					url: repository.url
				}
			]
		}
	});
};

firstTimeRunningRichPresence = false;

module.exports = { rpc };