# OCR Scribae Bot

A *quick and dirty "private"* Telegram bot that uses OCR to extract text from a document and send it to a GitHub repository

## Install

It's required to have ```pdftotext``` command utility installed

```
git clone https://github.com/Ventrosky/ocr-scribae-bot.git
cd ocr-scribae-bot
npm i
```

## Configure

Set the following enviroment variables:

```
BOT_TOKEN = <telegram_bot_token>
USER_ID =  <telegram_user_id>
GITHUB_TOKEN = <github_token>
GITHUB_OWNER = <github_owner>
GITHUB_REPO =  <github_repo>
GITHUB_PATH = <upload_file_path>
```


## Run

```
npm run start
```