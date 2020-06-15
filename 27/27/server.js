var TelegramBot = require('node-telegram-bot-api');

var token = '1241905283:AAGjq3A9YJvQ4msBdka5gw5G7zlreGiS-wY';

var bot = new TelegramBot(token, { polling: true });

bot.onText(/(.+)/, function (msg, match) {
    var fromId = msg.from.id;
    var resp = match[1];
    bot.sendMessage(fromId, 'echo:' + resp);
    bot.getUpdates();
});