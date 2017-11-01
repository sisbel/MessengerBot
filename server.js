'use strict';

require('dotenv').config();
// Imports dependencies and set up http server
const
    request = require('request'),
    express = require('express'),
    bodyParser = require('body-parser'),
    app = express().use(bodyParser.json()); // creates express http server

// Sets server port and logs message on success
var port = (process.env.PORT || 5000);
app.listen(port, function() {
    console.log('Webhook is listening on port: ' + port);
});

//=============================================================================
var received_updates = [];
app.get('/', function(req, res) {
    console.log(req);
    res.send('<pre>' + JSON.stringify(received_updates, null, 2) + '</pre>');

});
// Adds support for GET requests to our webhook
app.get('/facebook', function(req, res) {

    // Your verify token. Should be a random string.
    var VERIFY_TOKEN = process.env.VERIFY_TOKEN;
    const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

    // Checks the mode and token sent is correct
    if (req.param('hub.mode') == 'subscribe' &&
        req.param('hub.verify_token') == VERIFY_TOKEN) {

        // Responds with the challenge token from the request
        res.send(req.param('hub.challenge'));
        console.log('WEBHOOK_VERIFIED');

    } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);
    }
});

app.post('/facebook', function(req, res) {
    console.log('Facebook request body:', req.body);
    //================================================
    var body = req.body;
    if(body.object === 'page') {
        body.entry.forEach(function(entry) {
            // Get the webhook event. entry.messaging is an array, but
            // will only ever contain one event, so we get index 0
            var webhook_event = entry.messaging[0];
            console.log(webhook_event);
            var sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);
            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
            }

        });
        res.status(200).send('EVENT_RECEIVED');
    }
    else{
        res.sendStatus(404);
    }
});

app.listen();

// Handles messages events
function handleMessage(sender_psid, receivedMessage) {
    var response;

    // Check if the message contains text
    if (receivedMessage.text) {

        // Create the payload for a basic text message
        response = {
            "text": 'You sent the message, Now send me an image!'
        }
    }

    // Sends the response message
    callSendAPI(sender_psid, response);
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {

}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
    // Construct the message body
    var message = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, function(err, res, body) {
        if (!err) {
        console.log('message sent!')
    } else {
        console.error("Unable to send message:" + err);
    }
});
}