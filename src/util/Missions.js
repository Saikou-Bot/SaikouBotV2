const { toFixed, round, getRandomInt, choose, chooseValue } = require('./Util');
const {
	WEAPON_NAMES,
	WEAPONS_CATEGORY,
	WEAPON_CATEGORIES,
	BASE_ENTRANCE_NAMES,
	SESSION_TYPE_NAMES,
	MISSION_TASK_ADDITION_NAMES,
	RELATIONSHIP_TYPE_NAMES, 
	PERSON_NAMES,
	SHOT_AREA_NAMES,
	VEHICLE_NAMES,
	VEHICLE_ARMOR_CATEGORY,
	VEHICLE_ARMOR_CATEGORIES,
	VEHICLE_CATEGORY_NAMES
} = require('./Constants');

function matchesCategory(category, match) {
	return Object.entries(category).filter(e => e[1] === match).map(e => e[0]);
}

module.exports = [
	() => `Get **${getRandomInt(1, 20)}** kills in one play session with the \`${chooseValue(WEAPON_NAMES)}\`.`,
	() => `Raid **${getRandomInt(1, 5)}** players bases by using the \`${chooseValue(BASE_ENTRANCE_NAMES)}\`.`,
	() => `**Complete** your base in ${round(getRandomInt(60), 5)} minutes of \`${chooseValue(SESSION_TYPE_NAMES)}\`.`,
	() => `Get **${getRandomInt(1, 20)}** kills whilst playing with \`${chooseValue(MISSION_TASK_ADDITION_NAMES)}\`.`,
	() => `Get **${getRandomInt(1, 20)}** kills in ${chooseValue(SESSION_TYPE_NAMES)} whilst playing with \`${chooseValue(MISSION_TASK_ADDITION_NAMES)}\`.`,
	() => `Become **${chooseValue(RELATIONSHIP_TYPE_NAMES)}** with \`${chooseValue(PERSON_NAMES)}\` in your server.`,
	() => `Destroy **${getRandomInt(1, 10)}** vehicles in ${chooseValue(SESSION_TYPE_NAMES)} with the ${WEAPON_NAMES[choose(matchesCategory(WEAPONS_CATEGORY, WEAPON_CATEGORIES.EXPLOSIVE))]}.`,
	() => `Get **${getRandomInt(1, 5)}** ${chooseValue(SHOT_AREA_NAMES)} with the \`${chooseValue(WEAPON_NAMES)}\`.`,
	() => `Kill **${getRandomInt(1, 10)}** players with the \`${VEHICLE_NAMES[choose(matchesCategory(VEHICLE_ARMOR_CATEGORY, VEHICLE_ARMOR_CATEGORIES.SHOOTABLE))]}\`.`,
	() => `Have a **1v1** battle with ${chooseValue(PERSON_NAMES)} in \`${chooseValue(VEHICLE_CATEGORY_NAMES)}\`.`,
	() => `Storm into **${getRandomInt(1, 5)}** players bases using the \`${VEHICLE_NAMES[choose(matchesCategory(VEHICLE_ARMOR_CATEGORY, VEHICLE_ARMOR_CATEGORIES.SHOOTABLE))]}\`.`,
	() => `Gain **${getRandomInt(1, 5)}** kills whilst playing on the \`${chooseValue(MISSION_TASK_ADDITION_NAMES)}\`.`,
	() => `Kill **${getRandomInt(1, 5)}** enemy players in \`vehicles\`.`,
	() => `Find the **only** hidden secret found within the \`map\`.`,
	() => `Gain **${getRandomInt(1, 10)}** kills using only the \`${chooseValue(WEAPON_NAMES)}\`.`,
	() => `Find and destroy **${getRandomInt(1, 5)}** enemies using the \`${chooseValue(WEAPON_NAMES)}\`.`,
	() => `Find and kill **${getRandomInt(1, 2)}** enemy players who own a \`Gamepass\``
]