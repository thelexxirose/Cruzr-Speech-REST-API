//Language model module
module.exports = class GPT3 {
    constructor() {
        //Initialize OpenAI GPT3
        this.OpenAI = require('openai-nodejs');

        // Load your key from an environment variable or secret management service
        this.OPENAI_API_KEY = process.env.OPENAI_API_KEYY;
        //this.result = 'undeff'
        
    }

    //method that sends text to GPT3 and returns a text response
    async gpt3_message(message) {
        
        
        const openai = new this.OpenAI(this.OPENAI_API_KEY);
        console.log('API cred');
        //Send request to GPT3
        openai.complete(message,
            {max_tokens: 64,
              engine: 'davinci',
              max_tokens: 5,
              temperature: 0.9,
              top_p: 1,
              frequency_penalty: 1,
              best_of: 1,
              n: 1,
              stream: false,
              stop: ['\User:', '\n']
            })
        .then(completion => {
            console.log(`Bot: ${completion.choices[0].text}`);
            const result = completion.choices[0].text;
            console.log('test result  ' + result)
        })
        .catch(console.error);
     
        
        //return this.result;
    }
    
    //Method that calls GPT3 with a callback function
    async GPT(query, _callback) {
        let res = await this.gpt3_message(query);
        
        _callback(res);
    }
}