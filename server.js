'use strict';

// Imports dependencies and set up http server
const
    express = require('express'),
    bodyParser = require('body-parser'),
    app = express().use(bodyParser.json()); // creates express http server

// Sets server port and logs message on success
var port = (process.env.PORT || 5000);
app.listen(port, function() {
    console.log('Webhook is listening on port: ' + port);
});

//=============================================================================
// Creates the endpoint for our webhook
app.post('/webhook', function(req, res) {

    var body = req.body;

// Checks this is an event from a page subscription
    if (body.object === 'page') {

        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach(function(entry) {

            // Gets the message. entry.messaging is an array, but
            // will only ever contain one message, so we get index 0
            var webhookEvent = entry.messaging[0];
            console.log(webhookEvent);
        });

        // Returns a '200 OK' response to all requests
        res.status(200).send('EVENT_RECEIVED');
    } else {
        // Returns a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }

});

//=============================================================================
// Adds support for GET requests to our webhook
app.get('/facebook', function(req, res) {

    // Your verify token. Should be a random string.
    var VERIFY_TOKEN = process.env.VERIFY_TOKEN;

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
});

app.listen();