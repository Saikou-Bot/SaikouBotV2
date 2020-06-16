const fs = require('fs');
const path = require('path');

const itemsPath = path.join(__dirname, '../items/');

module.exports = (client) => {
	fs.readdirSync(itemsPath).forEach((category) => {
		const categoryPath = path.join(itemsPath, category);
		fs.readdirSync(categoryPath).forEach((item) => {
			console.log(item);
			const itemPath = path.join(categoryPath, item);
			const itemFile = require(itemPath);
			if (!itemFile || typeof itemFile != 'object' || typeof itemFile.name != 'string') return;
			itemFile.category = category;
			client.items.set(itemFile.name, itemFile);
		});
	});
};
