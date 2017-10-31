'use strict';

require('dotenv').config();
// Imports dependencies and set up http server
const
    express = require('express'),
    bodyParser = require('body-parser'),
    app = express().use(bodyParser.json()) && require('./WatConversation'); // creates express http server

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