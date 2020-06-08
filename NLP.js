//Natural Language Processing module
module.exports = class NLP {
    constructor(language) {
        this.language = language;
        this.dialogflow = require('dialogflow');
        this.uuid = require('uuid');
    }

    //method that sends text to dialogflow and returns a text response
    async dflowProccessing(message, projectId = 'hilda-lpjuyr') {
        //create a session ID
        const sessionId = this.uuid.v4();
    
        //Instanciate a new SessionsClient
        const sessionClient = new this.dialogflow.SessionsClient({
            projectId: projectId,
            keyFilename: '../hilda-dialogflow-credentials.json'
        });

        //
        const sessionPath = sessionClient.sessionPath(projectId, sessionId);
    
        //Construct the request
        const request = {
            session: sessionPath,
            queryInput: {
                text: {
                    text: message,
                    languageCode: this.language
                }
            }
        };
    
        //Send request to dialogflow
        const responses = await sessionClient.detectIntent(request);
        console.log('Detected intent');
        //Get result from dialogflow
        const result = responses[0].queryResult;
        //See if response matches an intent 
        if (result.intent) {
            console.log('Intent: ' + result.intent.displayName);
            console.log('Message: ' + result.fulfillmentText);
            var res = result;
        } else {
            console.log('No intent matched');
        }
        //Returns the result in the form of JSON
        return res;
    }
    
    //Method that calls dflowProcessing with a callback function
    async resolveQuery(query, _callback) {
        let res = await this.dflowProccessing(query);
        
        _callback(res);
    }
}