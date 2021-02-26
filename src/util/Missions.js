const { toFixed, round, getRandomInt, choose } = require('./Util');
const { MISSION } = require('./Constants');

module.exports = [
	() => `Get **${getRandomInt(20)}** kills in one play session with the \`${choose(MISSION.WEAPONS)}\`.`,
	() => `Raid **${getRandomInt(5)}** players bases by using the \`${choose(MISSION.BASE_ENTRANCES)}\`.`,
	() => `**Complete** your base in ${round(getRandomInt(60), 5)} minutes of \`${choose(MISSION.SESSION_TYPES)}\`.`,
	() => `Get **${getRandomInt(20)}** kills whilst playing with \`${choose(MISSION.TASK_ADDITION)}\`.`,
	() => `Get **${getRandomInt(20)}** kills in ${choose(MISSION.SESSION_TYPES)} whilst playing with \`${choose(MISSION.TASK_ADDITION)}\`.`,
	() => `Become **${choose(MISSION.FRIENDSHIP_TYPE)}** with \`${choose(MISSION.PERSONS)}\` in your server.`,
	() => `Destroy **${getRandomInt(10)}** vehicles in ${choose(MISSION.SESSION_TYPES)} with the .`
]