const UserData = require('../../models/userData.js');

module.exports = {
    config: {
        name: 'sell',
        description: 'Sell an item if you are low on cash.',
        usage: '.sell <item>',
        accessableby: 'Public',
        aliases: ['remove'],
    },
    run: async (bot, message, args) => {


        const Name = args.join(' ');

        UserData.findOne({ userID: message.author.id }, {}, { 'items.itemQuantity': { '$gt': 1 } }, (err, quantityData) => {
            if (err) console.log(err);

            console.log(quantityData);

            UserData.findOne({
                userID: message.author.id, 'items.itemName': Name,
            }, (err, userData) => {
                if (err) console.log(err);


                if (!userData || userData === null) {
                    return message.channel.send('Item doesn\'t exist! ');
                }

                else if (quantityData) {
                    userData.coins += 500;
                    userData.save();
                    //  console.log(itemSellPrice)

                    UserData.updateOne({ userID: message.author.id, 'items.itemName': Name }, { $inc: { 'items.$.itemQuantity': -1 } }).catch(err => console.log(err));

                    message.channel.send('Took 1 away from quantity and gave money');

                }
                else {

                    userData.coins += 500;
                    userData.save();

                    UserData.updateOne({ userID: message.author.id }, { $pull: { 'items': { 'itemName': Name } } }).catch(err => console.log(err));

                    message.channel.send('removed item and gave money');
                }

            });
        });


    },
};