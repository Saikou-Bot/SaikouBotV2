exports.Colors = {
	BLURPLE: 0x7289DA,
	RED: 0xf94343,
	GREEN: 0x2ED85F
}

exports.MENTION_REG = /^(?:<@!?)?(\d{17,19})(?:>)?$/;

exports.HUMAN_READABLE_PREFIXES = {
	'24': 'Y',
	'21': 'Z',
	'18': 'E',
	'15': 'P',
	'12': 'T',
	'9': 'G',
	'6': 'M',
	'3': 'k',
	'0': '',
	'-3': 'm',
	'-6': 'µ',
	'-9': 'n',
	'-12': 'p',
	'-15': 'f',
	'-18': 'a',
	'-21': 'z',
	'-24': 'y'
}

exports.MWT_FACTS = [
	"The `minigun` is the only weapon in the game that has a ready period before firing.",
	"The `dual revolvers` are the only weapon in the game that has a dual version compared to it's standard version.",
	"The `flamethrower` is the only obtainable weapon in the game that can deal damage over time after being hit.",
	"The `Golden Katana` used to not be so gold, at one point it was purple but had it's colour changed to feel more satisfying to gain.",
	"The `Helicopter` is the fastest vehicle in the game with an amazing speed of 100!",
	"The `Helicopter` is the only obtainable vehicle in the game that is flyable.",
	"The `Multiple Launch Rocket System` fires 21 rockets dealing 75 damage per one.",
	"The `Laser Pistol` is the only weapon in the game that has piercing through multiple bodies when being hit.",
	"The `Golden Pistol` is the only weapon rank reward for reaching General.",
	"The `Golden Pistol`, `Golden Katana` and `Golden Railgun` are the only 3 weapons in the game that have a golden variant.",
	"There is a total of 5 `Gamepasses` that are currently obtainable.",
	"The `Tactical Airstrike` is the only weapon in the game that allows players to strike with fighter jets.",
	"There is at least one `easter egg` hidden within Military Warfare Tycoon.",
	"Military Warfare Tycoon currently features `7` vehicles for players to use.",
	"Each `seasonal event` within the game has had a unique weapon as an obtainable reward.",
	"The `Railgun` used to have a charge time before firing, this typically meant players had to prepare their shot.",
	"The `Burst Rifle` is the only weapon in that game that fires in burst shots.",
	"Military Warfare Tycoon hit a whopping `60 million` visits on the 18th January 2021!",
	"The `Helicopter` used to shoot primarily missiles, however they were removed in favour for something more effective!",
	"The `Tycoon` used to have no owner only doors, meaning anyone could of roamed into your base without you wanting them to!",
	"Players used to have no `kill saving` in the game, meaning to get General they would have to do it all in one server! Ouch.",
	"There are `13` badges that give/gave a weapon that damaged other players.",
	"There used to be an `easter egg` that allowed you to spawn a secret AC-130 gunship on top of a mountain. The button to spawn it was hidden in one of the trees.",
	"The `Staff of Sparks` was added as a replacement for the `Real Golden Pistol`, which deals 999 explosive damage and has unlimited ammo capacity. Only official Saikou staff members are able to spawn it in game.",
	"The `VIP gamepass` used to be free to obtain during the Military Warfare Tycoon alpha release back in 2017. Less than 100 people signed up to grab it for free.",
	"The `Military Axe` was the first ever seasonal event item to be introduced to Military Warfare Tycoon.",
	"Military Warfare Tycoon's game page says the game was `created` in 2011, but this is incorrect. The game was first launched on the 1st of July 2017.",
	"The `Halloween event` in Military Warfare Tycoon took place ever year, except 2020. There was not enough time to release it, so the developers decided to cancel the event. However two months later, they released one of the biggest events to date - the Christmas 2020 event - combined with a dark look and feel to still get some spooky Halloween vibes.",
]

exports.CATEGORY_DISPLAY_NAMES = {
	'info': 'ℹ️ Information',
	'fun': '🎲 Fun' 
}

/// Weapons
exports.WEAPON_CATEGORIES = {
	MISC: 0,
	KNIFE: 1,
	AR: 2,
	SNIPER: 3,
	EXPLOSIVE: 4
}

exports.WEAPONS = {
	DEFAULT_KNIFE: 0,
	FLAMETHROWER: 1,
	LIGHT_MACHINE_GUN: 2,
	REMOTE_MINE: 3,
	ROCKET_LAUNCHER: 4
}

exports.WEAPONS_CATEGORY = {
	[exports.WEAPONS.DEFAULT_KNIFE]: exports.WEAPON_CATEGORIES.KNIFE,
	[exports.WEAPONS.FLAMETHROWER]: exports.WEAPON_CATEGORIES.MISC,
	[exports.WEAPONS.LIGHT_MACHINE_GUN]: exports.WEAPON_CATEGORIES.AR,
	[exports.WEAPONS.REMOTE_MINE]: exports.WEAPON_CATEGORIES.EXPLOSIVE,
	[exports.WEAPONS.ROCKET_LAUNCHER]: exports.WEAPON_CATEGORIES.EXPLOSIVE
}

exports.WEAPON_NAMES = {
	[exports.WEAPONS.DEFAULT_KNIFE]: 'Default Knife',
	[exports.WEAPONS.FLAMETHROWER]: 'Flamethrower',
	[exports.WEAPONS.LIGHT_MACHINE_GUN]: 'Light Machine Gun'
}

/// Base entrances
exports.BASE_ENTRANCES = {
	BACK_ENTERANCE: 0
}

exports.BASE_ENTRANCE_NAMES = {
	[exports.BASE_ENTRANCES.BACK_ENTERANCE]: 'back enterance'
}

/// Sessions
exports.SESSION_TYPES = {
	ONE_PLAY_SESSION: 0
}

exports.SESSION_TYPE_NAMES = {
	[exports.SESSION_TYPES.ONE_PLAY_SESSION]: 'one play session'
}

/// Task Additions
exports.MISSION_TASK_ADDITIONS = {
	MAX_SENSITIVITY: 0,
	FIRST_PERSON: 1
}

exports.MISSION_TASK_ADDITION_NAMES = {
	[exports.MISSION_TASK_ADDITIONS.MAX_SENSITIVITY]: 'max sensitivity',
	[exports.MISSION_TASK_ADDITIONS.FIRST_PERSON]: 'first person'
}

/// Persons
exports.PERSONS = {
	ANOTHER_PERSON: 0
}

exports.PERSON_NAMES = {
	[exports.PERSONS.ANOTHER_PERSON]: 'another person'
}

/// Relationships
exports.RELATIONSHIP_TYPES = {
	ALLIES: 0
}

exports.RELATIONSHIP_TYPE_NAMES = {
	[exports.RELATIONSHIP_TYPES.ALLIES]: 'allies'
}

/// Shot Areas
exports.SHOT_AREAS = {
	HEADSHOT: 0,
	BODYSHOT: 1
}

exports.SHOT_AREA_NAMES = {
	[exports.SHOT_AREAS.HEADSHOT]: 'headshot',
	[exports.SHOT_AREAS.BODYSHOT]: 'bodyshot'
}

/// Vehicles
exports.VEHICLES = {
	JEEP: 0,
	HELICOPTER: 1
}

exports.VEHICLE_CATEGORIES = {
	TANKS: 0,
	CAR: 1,
	ARIEL: 2
}

exports.VEHICLE_CATEGORY_NAMES = {
	[exports.VEHICLE_CATEGORIES.TANKS]: 'tanks',
	[exports.VEHICLE_CATEGORIES.CAR]: 'car',
	[exports.VEHICLE_CATEGORIES.ARIEL]: 'ariel'
}

exports.VEHICLE_CATEGORY = {
	[exports.VEHICLES.JEEP]: exports.VEHICLE_CATEGORIES.CAR,
	[exports.VEHICLES.HELICOPTER]: exports.VEHICLE_CATEGORIES.ARIEL
}

exports.VEHICLE_ARMOR_CATEGORIES = {
	SHOOTABLE: 0, // there is prop better name for this but I can't find it
	UNARMORED: 1
}

exports.VEHICLE_NAMES = {
	[exports.VEHICLES.JEEP]: 'jeep',
	[exports.VEHICLES.HELICOPTER]: 'helicopter'
}

exports.VEHICLE_ARMOR_CATEGORY = {
	[exports.VEHICLES.JEEP]: exports.VEHICLE_ARMOR_CATEGORIES.UNARMORED,
	[exports.VEHICLES.HELICOPTER]: exports.VEHICLE_ARMOR_CATEGORIES.SHOOTABLE
}

// exports.MISSION = {
// 	WEOPONS: {
// 		DEFAULT_KNIFE: exports.WEAPON_CATEGORIES.KNIFE,
// 		FLAMETHROWER: exports.WEAPON_CATEGORIES.MISC,

// 	},
// 	BASE_ENTRANCES: [
// 		'back enterance'
// 	],
// 	SESSION_TYPES: [
// 		'one play session'
// 	],
// 	TASK_ADDITION: [
// 		'max sensitivity',
// 		'First person'
// 	],
// 	FRIENDSHIP_TYPES: [
// 		'allies'
// 	],
// 	PERSONS: [
// 		'another person'
// 	]
// }

exports.EIGHTBALL_REPLIES = [
	'It is certain',
	'It is decidedly so',
	'Without a doubt',
	'Yes - definitely',
	'You may rely on it',
	'As I see it, yes',
	'Most likely',
	'Outlook good',
	'Yes',
	'Signs point to yes',
	'Reply hazy, try again',
	'Ask again later',
	'Better to not tell you now',
	'Cannot predict now',
	'Don\'t count on it',
	'My reply is no',
	'My sources say no',
	'Outlook not so good',
	'Very doubtful',
	'Certainly not',
]
