//Text To Speech module
module.exports = class TTS {
    constructor(language, projectName, credentials) {

        this.language = language;

        this.projectName = projectName;
        this.credentials = credentials;
        // Imports the Google Cloud client library
        this.textToSpeech = require('@google-cloud/text-to-speech');

        // Import other required libraries
        this.fs = require('fs');
        this.util = require('util');
        // Creates a client
        this.client = new this.textToSpeech.TextToSpeechClient({
            projectId: this.projectName,
            keyFilename: this.credentials
        });
    }

    
    //tts method. creates an mp3 file to outputAudio directory
    async tts(text) {
        // Construct the request
        const request = {
            input: {text: text},
            // Select the language and SSML voice gender (optional)
            voice: {languageCode: this.language, ssmlGender: 'NEUTRAL'},
            // select the type of audio encoding
            audioConfig: {audioEncoding: 'MP3'},
        };

        //Performs the tts request
        const [response] = await this.client.synthesizeSpeech(request);
        //Write the binary audio content to a local file
        const writeFile = this.util.promisify(this.fs.writeFile);
        await writeFile('./outputAudio/output.mp3', response.audioContent, 'binary');
        console.log('Audio content written to file: output.mp3');
    }
}