module.exports = class NLP {
    constructor(language) {
        this.language = language;
        this.dialogflow = require('dialogflow');
        this.uuid = require('uuid');
    }

    async dflowProcessing(message, projectId = 'hilda-lpjuyr') {
        const sessionId = this.uuid.v4();
    
        const sessionClient = new this.dialogflow.SessionsClient({
            projectId: projectId,
            keyFilename: '../dialogflow_hilda.json'
        });
        const sessionPath = sessionClient.sessionPath(projectId, sessionId);
    
        const request = {
            session: sessionPath,
            queryInput: {
                text: {
                    text: message,
                    languageCode: this.language
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
    async resolveQuery(query, _callback) {
        let res = await this.dflowProcessing(query);
        
        _callback(res);
    }
}