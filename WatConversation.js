var express         = require('express'); // app server
var bodyParser      = require('body-parser'); // parser for post requests
var Conversation    = require('watson-developer-cloud/conversation/v1'); // watson sdk

// Bootstrap application settings
app.use(express.static('./public')); // load UI from public folder
app.use(bodyParser.json());

// Create the service wrapper
var conversation = new Conversation({
    'username'      : process.env.CONVERSATION_USERNAME,
    'password'      : process.env.CONVERSATION_PASSWORD,
    'version_date'  : process.env.VERSION_DATE
});

// Endpoint to be call from the client side
app.post('/api/message', function(req, res) {
    var workspace = process.env.WORKSPACE_ID || '<workspace-id>';
    if (!workspace || workspace === '<workspace-id>') {
        return res.json({
            'output': {
                'text': 'The app has not been configured with a workspace'
            }
        });
    }
    var payload = {
        workspace_id: workspace,
        context: req.body.context || {},
        input: req.body.input || {}
    };

    // Send the input to the conversation service
    conversation.message(payload, function(err, data) {
        if (err) {
            return res.status(err.code || 500).json(err);
        }
        return res.json(updateMessage(payload, data));
    });
});