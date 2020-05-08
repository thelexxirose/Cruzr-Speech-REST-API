const dialogflow = require('dialogflow');
const uuid = require('uuid');

const https = require('https');
const fs = require('fs')
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const dotenv = require('dotenv');

dotenv.config();

//test
async function dflowProccessing(message, projectId = 'hilda-lpjuyr') {
    const sessionId = uuid.v4();

    const sessionClient = new dialogflow.SessionsClient();
    const sessionPath = sessionClient.sessionPath(projectId, sessionId);

    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: message,
                languageCode: "en-US"
            }
        }
    };

    const responses = await sessionClient.detectIntent(request);
    console.log('Detected intent');
    const result = responses[0].queryResult;
    if (result.intent) {
        console.log('Intent: ' + result.intent.displayName);
        console.log('Message: ' + result.fulfillmentText);
        var res = result;
    } else {
        console.log('No intent matched');
    }
    return res;
}

// function that runs runSample
async function resolveQuery(query, _callback) {
    var query = await dflowProccessing(query);
    
    _callback(query);
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res) => {
    res.send('REST is working');
});

app.post('/dialogflowMessage', (req, res) => {
    var query = req.body.text;
    console.log('dialogflowMessage query: ' + query);
    resolveQuery(query, (msg) => {
        var result = {
            fulfillmentText: msg.fulfillmentText,
            fields: msg.parameters.fields,
            intent: msg.intent.displayName
        }
        console.log(result);
        res.send(result);
    })
});

app.post('/test', (req, res) => {
    res.send("POST is working!")
})

app.listen(port, () => {
    console.log('Listening on port: ' + port)
});


