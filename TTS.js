module.exports = class TTS {
    constructor(language) {
        // Imports the Google Cloud client library
        this.textToSpeech = require('@google-cloud/text-to-speech');

        // Import other required libraries
        this.fs = require('fs');
        this.util = require('util');
        // Creates a client
        this.client = new this.textToSpeech.TextToSpeechClient({
            projectId: 'delta-exchange-279407',
            keyFilename: '../MyFirstProject.json'
        });
        this.language = language;
    }

    

    async tts(text) {
        // Construct the request
        const request = {
            input: {text: text},
            // Select the language and SSML voice gender (optional)
            voice: {languageCode: this.language, ssmlGender: 'NEUTRAL'},
            // select the type of audio encoding
            audioConfig: {audioEncoding: 'MP3'},
        };

        // Performs the text-to-speech request
        const [response] = await this.client.synthesizeSpeech(request);
        // Write the binary audio content to a local file
        const writeFile = this.util.promisify(this.fs.writeFile);
        await writeFile('./outputAudio/output.mp3', response.audioContent, 'binary');
        console.log('Audio content written to file: output.mp3');
    }
}