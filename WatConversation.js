require('dotenv').config();

var express         = require('express'); // app server
var bodyParser      = require('body-parser'); // parser for post requests
var Conversation    = require('watson-developer-cloud'); // watson sdk

// Create conversation wrapper
var conversationWrapper = new Conversation.conversation({
    'username'      : process.env.CONVERSATION_USERNAME,
    'password'      : process.env.CONVERSATION_PASSWORD,
    'version'       :'v1',
    'version_date'  : process.env.VERSION_DATE
});

conversationWrapper.message({
    workspace_id: process.env.WORKSPACE_ID,
    input: {'text': 'cookies'}
}, function (err, response) {
    if (err)
        console.log('error:', err);
    else
        console.log(response.output.text[0]);
})