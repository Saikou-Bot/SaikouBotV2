const canvas = require('canvas');
const MessageAttachment = require('../../node_modules/discord.js/src/structures/MessageAttachment');
const credits = require('../../models/userData');
const items = require('../../models/userItems');


// canvas.registerFont('./Fonts/UniSansSemiBold.ttf', {
// 	family: 'Uni Sans',
// 	weight: 'Semi Bold',
// });

// canvas.registerFont('./Fonts/UniSansRegular.ttf', {
// 	family: 'Uni Sans',
// 	weight: 'Regular',
// });


module.exports = {
	config: {
		name: 'profile',
		description: 'Displays your profile which lists a whole bunch of info.',
		usage: '.profile [user]',
		accessableby: 'Followers+',
		aliases: ['prof', 'stats'],
		channel: 'bot-commands',
		cooldown: true,
		autoCooldown: true,
	},
	run: async ({ client: bot, message, args, utils: { getMember } }) => {


		const member = getMember(message, args.join(' '));
		const userCredits = await credits.findOne({ userID: member.id });
		const userItems = await items.find({ userID: member.id });

		const avatar = await canvas.loadImage(member.user.displayAvatarURL({ format: 'png', size: 2048 }));
		const name = member.displayName.length > 14 ? member.displayName.substring(0, 12) + '...' : member.displayName;

		let roleMsg = new String();
		if (member.roles.cache.some(r => r.name === 'Translator')) { roleMsg += 'Translator'; }
		else if (member.id === '229142187382669312' || member.id === '670588428970098708') { roleMsg += 'Bot Dev'; }
		else if (member.roles.cache.some(r => r.name === 'Server Booster')) { roleMsg += 'Booster'; }
		else if (member.roles.cache.some(r => r.name === 'Tester')) { roleMsg += 'Tester'; }
		else if (member.roles.cache.some(r => r.name === 'Staff')) { roleMsg += 'Staff'; }
		else { roleMsg += 'Member'; }

		const profileImage = canvas.createCanvas(400, 400);
		const profile = profileImage.getContext('2d');

		// Blurple top background
		profile.fillStyle = colours.blurple;
		profile.fillRect(0, 0, 400, 185);

		// Grey bottom background
		profile.fillStyle = colours.darkgrey;
		profile.fillRect(0, 185, 400, 200);

		// Name box
		profile.lineJoin = 'round';
		profile.lineWidth = '20';
		profile.strokeStyle = colours.darkgrey;
		profile.strokeRect(180, 40, 430, 35);
		profile.fillRect(180, 40, 430, 35);

		profile.strokeRect(220, 120, 200, 30);
		profile.fillRect(220, 120, 200, 30);

		profile.fillStyle = '#FFFFFF';
		profile.textAlign = 'center';
		profile.font = '25pt UniSansSemiBold';
		profile.fillText(`${name}`, 285, 68, 400, 30);

		profile.font = '22pt UniSansSemiBold';
		profile.fillText(`${roleMsg}`, 305, 145, 400, 30);


		// Inventory
		profile.font = '20pt UniSansSemiBold';
		profile.fillText('Inventory', 70, 220, 400, 30);
		profile.fillText('Balance', 270, 220, 400, 30);
		profile.fillText('Active Items', 85, 320, 400, 30);
		profile.fillText('Multiplier', 275, 320, 400, 30);


		if(!userCredits) {
			const newData = new credits({
				username: member.user.username,
				userID: member.id,
				lb: 'all',
				coins: 0,
				medals: 0,
			});
			newData.save().catch(err => console.log(err));
			profile.font = '15pt UniSansRegular';
			profile.fillStyle = '#9A9A9A';
			profile.textAlign = 'left';
			profile.fillText('Credits: 0', 225, 250, 400, 30);
			profile.fillText('Medals: 0', 225, 275, 400, 30);
		}
		else {
			const creds = userCredits.coins > 9999999 ? userCredits.coins.toLocaleString().substr(0, 9) + '...' : userCredits.coins.toLocaleString();
			const medals = userCredits.medals > 9999999 ? userCredits.medals.toLocaleString().substr(0, 9) + '...' : userCredits.medals.toLocaleString();

			profile.font = '15pt UniSansRegular';
			profile.fillStyle = '#9A9A9A';
			profile.textAlign = 'left';
			profile.fillText(`Credits: ${creds}`, 225, 250, 400, 30);
			profile.fillText(`Medals: ${medals}`, 225, 275, 400, 30);
		}

		profile.textAlign = 'left';
		profile.fillText(`Currently owns\n${userItems.length} items.`, 18, 250, 400, 30);

		profile.fillText('Multiplier: 0', 225, 350, 400, 30);
		profile.fillText('No active items.', 18, 350, 400, 30);


		// Avatar outline/transparent background
		profile.fillStyle = colours.darkgrey;
		profile.beginPath();
		profile.arc(85, 90, 66, 0, Math.PI * 2);
		profile.fill();
		profile.lineWidth = 5;
		profile.strokeStyle = '#FFFFFF';
		profile.stroke();
		profile.closePath();


		// Avatar Picture
		profile.beginPath();
		profile.arc(85, 90, 64, 0, Math.PI * 2);
		profile.closePath();
		profile.clip();
		profile.drawImage(avatar, 21, 26, 128, 128);


		const attachment = new MessageAttachment(profileImage.toBuffer(), 'Profile.png');
		await message.channel.send(attachment);


	},
};