/* eslint-disable no-undef */
const { MessageEmbed } = require('discord.js');
const DBItems = require('../../models/items');
const fs = require('fs');

module.exports = {
    config: {
        name: 'shop2',
        description: 'Displays a shop where people can purchase items.',
        usage: '.shop',
        accessableby: 'Followers+',
        aliases: ['market', 'store'],
    },
    run: async (bot, message) => {

        fs.readdirSync('items/').forEach(category => fs.readdirSync('items/Defences').forEach(item => {
            const Fileitem = require(item);
            item.category = category; item.set(info.name, item);
        },

            DBItems.find({ inshop: true }, (shopItems) => {

                shopItems.map((items) => {
                    return Fileitem.get(items.info.price);
                });
            }),

        ));


    },
};