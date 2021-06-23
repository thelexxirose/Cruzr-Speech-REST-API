//Language model module
module.exports = class GPT3 {
    constructor(language) {
        //Initialize OpenAI GPT3
        this.OpenAI = require('openai-nodejs');
        this.language = language;
        // Load your key from an environment variable or secret management service
        this.OPENAI_API_KEY = process.env.OPENAI_API_KEYY;
        this.openai = new this.OpenAI(this.OPENAI_API_KEY);
        
    }

    //method that sends text to GPT3 and returns a text response
    async gpt3_message(message) {
         var prompt = '';
         var user = '';
         //let nor_prompt = "Bot er en veldig lykkelig, positiv og snill chatbot som alltid er klar for å hjelpe. \n Du: Hei, hvordan går det?\n Bot: Veldig bra takk! Hvordan går det med deg?\n Du: Bare bra!\n Bot: Det er fantastisk! Nå ble jeg veldig glad. Kan jeg hjelpe deg med noe?\n Du: Ja, gjerne.\n Bot: Hva enn du trenger. Du er min beste venn!\n Du: ";
         let nor_prompt = "Bot er en vennlig, positiv og snill chatbot som alltid er klar for å hjelpe. \n\nDu: Hei, hvordan går det? \nBot: Veldig bra takk! Hvordan går det med deg? \nDu: Bare bra! \nBot: Det er fantastisk! Kan jeg hjelpe deg med noe? \nDu: Ja, gjerne. \nBot: Hva er det du lurer på? \nDu: ";
         let eng_prompt = "Bot is a very cheerful and nice chatbot that is always ready to help and give compliments. \n\nHuman: Hey, how are you doing? \nBot: Very good, thank you! I love how you ask me that. How are you? \nHuman:I'm good! \nBot: That's wonderful! You just made me very happy. Can I help you with something? \nHuman: Yes, please. \nBot: Whatever you need! \nHuman: ";
         
         if (this.language == "no"){
             prompt = nor_prompt
             user = 'Du:'
         }
             
         if (this.language == "en"){
             prompt = eng_prompt
             user = 'Human:'
        }
       
        //Send request to GPT3
        
        const response = await this.openai.complete(
            prompt + message,
            {max_tokens: 64,
              engine: 'davinci',
              temperature: 0.9,
              top_p: 1,
              frequency_penalty: 0,
              best_of: 1,
              n: 1,
              stream: false,
              stop: [user, 'Bot:', '\n']
            })
       
        console.log(`Message from GPT3: ${response.choices[0].text}`);
        const result = response.choices[0].text;
    
        return result;
        
    }
    
    
}