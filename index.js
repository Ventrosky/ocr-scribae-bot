require('dotenv').config();
const axios = require('axios');
const textract = require('textract');
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

		// Proceed downloading
		const response = await axios.get(url.toString(), {
			responseType: 'arraybuffer'
		});

		// Performs text detection on the file
		const buffer = Buffer.from(response.data, 'base64');
		textract.fromBufferWithMime(file.mime_type, buffer, {'preserveLineBreaks': true},( error, text ) => {
			if (error != null) {
				bot.telegram.sendMessage(userID,'Titivillus! 😈');
				return;
			}

			const content = Buffer.from(text, 'utf8').toString('base64');  
			var data = JSON.stringify({
				'message': `OCR-Scribae: ${file.file_name}`,
				'content': content
			});
    
			// Commit file to github repo
			const name = file.file_name.replace(/\.[^.]*$/,'');
			var config = {
				method: 'put',
				url: `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/contents/${process.env.GITHUB_PATH}/${name}.md`,
				headers: {
					'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
					'Content-Type': 'application/json'
				},
				data: data
			};
			// eslint-disable-next-line no-unused-vars
			axios(config).then( _ => {
				bot.telegram.sendMessage(userID,'Scriptum facere 👍');
			// eslint-disable-next-line no-unused-vars
			}).catch((_) => {
				bot.telegram.sendMessage(userID,'Titivillus! 😈');
			});
		});
	} catch (error) {
		ctx.reply('Titivillus! 😈');
	}
});

bot.launch();

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));