var express = require('express');
var Bot = require('facebook-messenger-bot');

const app = express();
const bot = new Bot(myPageAccessToken, myVerification); // create bot instance

app.use('/facebook', bot.router()); // use the router
app.listen(3000);