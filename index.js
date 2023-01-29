require('dotenv').config();
const axios = require('axios');
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);
const userID = parseInt(process.env.USER_ID,10);

bot.start((ctx) => ctx.reply('Salutatio'));

bot.help((ctx) => ctx.reply('Documentum providere'));

bot.on('document', async ctx => {
	if (ctx.message.chat.id != userID){
		ctx.reply('Vetiti ✋');
	}
	
	try {
		const file = ctx.update.message.document;
		const url = await ctx.telegram.getFileLink(file.file_id);

		const response = await axios.get(url.toString(), {
			responseType: 'arraybuffer'
		});

		var data = JSON.stringify({
			'message': `OCR-Scribae: ${file.file_name} original`,
			'content': response.data.toString('base64')
		});
		var config = {
			method: 'put',
			url: `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/contents/${process.env.GITHUB_PATH}/${file.file_name}`,
			headers: {
				'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
				'Content-Type': 'application/json'
			},
			data: data
		};
		// eslint-disable-next-line no-unused-vars
		axios(config).then( _ => {
			bot.telegram.sendMessage(userID,'Scriptum facere 👍');
		}).catch((e) => {
			console.log(e);
			bot.telegram.sendMessage(userID,'Titivillus! 😈');
		});
	} catch (error) {
		ctx.reply('Titivillus! 😈');
	}
});

bot.launch();

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));