module.exports = {
	name: 'wrap',
	construct(client) {
		return function wrap(msg, charLimit = 2000, wrapChar = '\n') {
			const messages = [];
			while (msg.length > charLimit) {
				const firstPart = msg.slice(0, charLimit);
				let lastNewline = firstPart.lastIndexOf('\n');
				if (lastNewline < 0) lastNewline = firstPart.length;
				messages.push(firstPart.slice(0, lastNewline));
				msg = msg.slice(lastNewline + 1);
			}
			if (msg) messages.push(msg);
			return messages;
		};
	}
};