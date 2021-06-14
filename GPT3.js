//Language model module
module.exports = class GPT3 {
    constructor() {
        //Initialize OpenAI GPT3
        this.OpenAI = require('openai-api');

        // Load your key from an environment variable or secret management service
        const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
        console.log('API creds: ' + this.OPENAI_API_KEY);
        

    }

    //method that sends text to GPT3 and returns a text response
    async gpt3_message(message) {
        
        const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
        
        const openai = new this.OpenAI(this.OPENAI_API_KEY);
        console.log('API cred: ' + this.OPENAI_API_KEY);
        //Send request to GPT3
        const gptResponse = await openai.complete({
                engine: 'davinci',
                prompt: 'text',
                maxTokens: 5,
                temperature: 0.9,
                topP: 1,
                presencePenalty: 0,
                frequencyPenalty: 0,
                bestOf: 1,
                n: 1,
                stream: false,
                stop: ['\n', "testing"]
            });
     
        //Get result from GPT3
        const result = gptResponse.choices[0].text;
        
        //Returns the result in the form of JSON
        return result;
    }
    
    //Method that calls GPT3 with a callback function
    async GPT(query, _callback) {
        let res = await this.gpt3_message(query);
        
        _callback(res);
    }
}