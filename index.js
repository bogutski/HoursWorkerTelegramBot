const TelegramBot = require('node-telegram-bot-api');
const { intervalDuration } = require('./intervalDuration');

// telegram bot token
const token = '*************';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// example of saving data
// {
//   chatId: 0,
//   rate: 10,
//   intervals: [],
// }
const chats = [];


bot.setMyCommands([
  { command: '/start', description: 'To begin press /start' },
  { command: '/rate', description: 'To get current rate press /rate' },
  { command: '/finish', description: 'To finish press /finish' },
]);


// Listen for any kind of message. There are different kinds of messages.
bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    // when user send /start
    if (msg.text === '/start') {
      // save in chats array chatId
      chats.push({ chatId, rate: null, intervals: [] });
      console.log(chats);
    }


    if (msg.text.startsWith('rate')) {
      const rate = msg.text.split(' ')[1];

      // convert rate to number
      const rateNumber = +rate;

      // check if rate is a number
      if (isNaN(rateNumber)) {
        bot.sendMessage(chatId, 'Please enter a number');
        return;
      }

      // check if rate is a positive number
      else if (rateNumber <= 0) {
        bot.sendMessage(chatId, 'Please enter a positive number');
        return;
      }

      // modify the rate of the user in the chats array
      // loop through the chats array
      // if the chatId of the current chat is the same as the chatId of the current user
      // then modify the rate of the current chat
      for (let i = 0; i < chats.length; i++) {
        if (chats[i].chatId === chatId) {
          chats[i].rate = rate;
        }
      }

      console.log(chats);
      bot.sendMessage(chatId, `Your rate is ${rate}`);
    }

    if (msg.text.startsWith('interval')) {
      // get the interval from the message
      const interval = msg.text.substring(9).trim();
      // add the interval to the intervals array of the current user
      for (let i = 0; i < chats.length; i++) {
        if (chats[i].chatId === chatId) {
          chats[i].intervals.push(interval);
        }
      }
      console.log(chats);

    }

    if (msg.text === '/finish') {
      // get the current chatId intervals
      let intervals = [];
      for (let i = 0; i < chats.length; i++) {
        if (chats[i].chatId === chatId) {
          intervals = chats[i].intervals;
        }
      }

      // calculate the total time in minutes with loop through the intervals array
      let totalTime = 0;
      for (let i = 0; i < intervals.length; i++) {
        totalTime += intervalDuration(intervals[i]);
      }


      // get the current chatId total amount of money
      let rate = 0; // rate per hour
      for (let i = 0; i < chats.length; i++) {
        if (chats[i].chatId === chatId) {
          rate = chats[i].rate;
        }
      }

      // calculate the total amount of money and round it to 2 decimal places
      const totalAmount = +(rate * totalTime / 60).toFixed(2);

      // get hours and minutes from total time
      const hours = Math.floor(totalTime / 60);
      const minutes = totalTime % 60;

      // send message to the user
      bot.sendMessage(chatId, `You worked ${hours} hours and ${minutes} minutes and earned ${totalAmount} dollars`);
      console.log(chats);
    }

  }
);




