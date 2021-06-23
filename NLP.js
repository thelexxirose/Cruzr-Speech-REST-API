//Natural Language Processing module
module.exports = class NLP {
    constructor(language, projectName, credentials) {
        
        this.language = language;
        
        this.projectName = projectName;
        this.credentials = credentials;
        
        this.dialogflow = require('dialogflow');
        this.uuid = require('uuid');
    }

    //method that sends text to dialogflow and returns a text response
    async dflowProcessing(message) {
        //create a session ID
        const sessionId = this.uuid.v4();
    
        //Instanciate a new SessionsClient
        const sessionClient = new this.dialogflow.SessionsClient({
            projectId: this.projectName,
            keyFilename: this.credentials
            
        });
        console.log('NLP creds: ' + this.credentials);

        //
        const sessionPath = sessionClient.sessionPath(this.projectName, sessionId);
    
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
        let res = await this.dflowProcessing(query, 'hilda-ipjuyr');
        
        _callback(res);
    }
}