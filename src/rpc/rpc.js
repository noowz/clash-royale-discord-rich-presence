const { name, version, bugs, repository } = require("../../package.json");
const { apis } = require("../config.json");
const { logger } = require("../utils/logger.js");
const { logErrorAndExit } = require("../utils/utils.js");
const axios = require("axios");
const gplay = require("google-play-scraper");

let firstTimeRunningRichPresence = true;

let startDate = firstTimeRunningRichPresence ? Date.now() : startDate;

const rpc = async function setActivity(client) {
	const clashroyaleResponse = await axios({
		method: "GET",
		url: `${apis.clashroyale.base_url}/players/%23${process.env.CLASH_ROYALE_PLAYER_TAG.replace("#", "")}`,
		headers: {
			"Authorization": `Bearer ${process.env.CLASH_ROYALE_API_KEY}`,
			"Content-Type": "application/json",
			"User-Agent": `${name}/${version}`
		}
	}).catch(error => {
		if (error.response.status === 400) {
			logger.error("Client provided incorrect parameters for the request.");

			logErrorAndExit(`ERROR: ${error.response.status} - ${error.response.statusText} (${error.response.data.reason})`);
		} else if (error.response.status === 403) {
			logger.error("Access denied, either because of missing/incorrect credentials or used API token does not grant access to the requested resource.");

			logErrorAndExit(`ERROR: ${error.response.status} - ${error.response.statusText} (${error.response.data.reason})`);
		} else if (error.response.status === 404) {
			logger.error("Resource was not found.");

			logErrorAndExit(`ERROR: ${error.response.status} - ${error.response.statusText} (${error.response.data.reason})`);
		} else if (error.response.status === 429) {
			logger.error("Request was throttled, because amount of requests was above the threshold defined for the used API token.");

			logErrorAndExit(`ERROR: ${error.response.status} - ${error.response.statusText} (${error.response.data.reason})`);
		} else if (error.response.status === 500) {
			logger.error("Unknown error happened when handling the request.");

			logErrorAndExit(`ERROR: ${error.response.status} - ${error.response.statusText} (${error.response.data.reason})`);
		} else if (error.response.status === 503) {
			logger.error("Service is temporarily unavailable because of maintenance.");

			logErrorAndExit(`ERROR: ${error.response.status} - ${error.response.statusText} (${error.response.data.reason})`);
		} else {
			logger.error(`An error has occurred. Report this at ${bugs.url} !`);

			logErrorAndExit(`ERROR: ${error.response.status} - ${error.response.statusText} (${error.response.data.reason})`);
		};
	});

	const player = clashroyaleResponse.data;

	const arenas = [
		"Training Camp",
		"Goblin Stadium",
		"Bone Pit",
		"Barbarian Bowl",
		"Spell Valley",
		"Builder's Workshop",
		"P.E.K.K.A's Playhouse",
		"Royal Arena",
		"Frozen Peak",
		"Jungle Arena",
		"Hog Mountain",
		"Electro Valley",
		"Spooky Town",
		"Rascal's Hideout",
		"Serenity Peak",
		"Miner's Mine",
		"Executioner's Kitchen",
		"Royal Crypt",
		"Silent Sanctuary",
		"Dragon Spa",
		"Boot Camp",
		"Clash Fest",
		"PANCAKES!",
		"Legendary Arena"
	];

	const pathOfLegendsleagues = [
		"Challenger I",
		"Challenger II",
		"Challenger III",
		"Master I",
		"Master II",
		"Master III",
		"Champion",
		"Grand Champion",
		"Royal Champion",
		"Ultimate Champion"
	];

	const royals2v2Leagues = [
		"Casual",
		"Competitive"
	];

	const app = await gplay.app({
		appId: "com.supercell.clashroyale"
	});

	client.request("SET_ACTIVITY", {
		pid: process.pid,
		activity: {
			details: `⭐ Level: ${player.expLevel} • 🏆 Trophies: ${player.trophies}/${player.bestTrophies} • 🛕 Arena: ${arenas.indexOf(player.arena.name)}`,
			state: `🏅 Path of Legends: ${player.currentPathOfLegendSeasonResult ? pathOfLegendsleagues[player.currentPathOfLegendSeasonResult.leagueNumber - 1] : pathOfLegendsleagues[0]} • 🏅 2v2 League: ${Object.keys(player.progress).length === 0 ? royals2v2Leagues[0] : player.progress.Royals_2v2_2025.arena.name}`,
			timestamps: {
				start: startDate
			},
			assets: {
				large_image: app.icon,
				large_text: app.title,
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