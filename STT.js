//Speech To Text module
module.exports = class STT {
    constructor(language, projectName, credentials) {
      
      this.language = language;

      this.projectName = projectName;
      this.credentials = credentials;

      // Imports the Google Cloud client library
      this.speechToText = require('@google-cloud/speech');
      this.fs = require('fs');
      this.Mp32Wav = require('mp3-to-wav');
      // Creates a client
      this.client = new this.speechToText.SpeechClient({
        projectId: this.projectName,
        keyFilename: this.credentials
      });
    }

    //Supposed to convert from mp3 to wav, but it currently doesn't work
    async mp3Converter(file) {
       new this.Mp32Wav('C:/Users/thele/Documents/NodeJS/Cruzr-client/audio' + file);
    }

    //stt method. returns a transcription of a wav sound file
    async stt(audioFile, encoding) {
      // The name of the audio file to transcribe
      const fileName = './audio/' + audioFile;
    
      // Reads a local audio file and converts it to base64
      const file = this.fs.readFileSync(fileName);
      const audioBytes = file.toString('base64');
    
      // The audio file's encoding, sample rate in hertz, and BCP-47 language code
      const audio = {
        content: audioBytes,
      };
      const config = {
        encoding: encoding,
        languageCode: this.language,
        audioChannelCount: 2,
        enableSeparateRecognitionPerChannel: false
      };
      const request = {
        audio: audio,
        config: config,
      };
    
      // Detects speech in the audio file
      const [response] = await this.client.recognize(request);
      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
      console.log(`Transcription: ${transcription}`);

      return transcription;
    }
}