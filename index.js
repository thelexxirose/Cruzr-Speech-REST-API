//Initialize packages
const linear16 = require('linear16');  
const path = require('path');  
const https = require('https');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const multer = require('multer');
const mime = require('mime');

//Make the three classes available for usage
const NLP = require('./NLP');
const STT = require('./STT');
const TTS = require('./TTS');


//Make ProjectVariables available for usage
const PV = require('./ProjectVariables')

class Server {
    constructor() {
        //declaring properties for multer
        this.storage;
        this.uploadDisk;
        //Run methods on start
        this.config();
        this.initClasses();
        this.initRoutes();
        this.startHttp();
        this.jsonObject = {
            fulfillmentText:"",
            fields:"",
            intent:""

        }
    }
    
    
    //Method to start https server. 
    startHttps() {
        https.createServer({
            key: fs.readFileSync('cruzr-gateway-sha256.key'),
            cert: fs.readFileSync('cruzr-gateway-sha256.crt')
        }, app).listen(port, () => {
            console.log('Listening on port: ' + port);
        });
        
    }

    //Method to start http server
    startHttp() {
        app.listen(port, () => {
            console.log('Listening on port: ' + port);
        });
    }

    //Configure express
    config() {
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());
        app.use(cors());
        app.use('/audio', express.static('./outputAudio'));
        this.storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, "./audio");
            },
            filename: (req, file, cb) => {
                console.log(file);


                cb(null, file.originalname)
            }
        });
        this.uploadDisk = multer({
            storage: this.storage
        });

        
    }

    //Define routes
    initRoutes() {
        //Get route used to see if REST is working
        app.get('/',function(req,res){
            res.sendFile(__dirname + '/index.html');
          
          });
        
        //Send a piece of text to dialogflow and returns an answer
        app.post('/dialogflowMessage', (req, res) => {
            //Retrieve query text
            let query = req.body.text;
            console.log('dialogflowMessage query: ' + query);
            //Send query to dialogflow
            this.nlp.resolveQuery(query, (msg) => {
                let result = {
                    fulfillmentText: msg.fulfillmentText,
                     fields: msg.parameters.fields,
                    intent: msg.intent.displayName
                }
                console.log(result);
                res.send(result);
            });
        });
        
        //Send a text referring to one of the wav files on the server, convert the soundfile to text, send it to dialogflow, and returns an answer while also making an answer sound file that is stored on the server 
        app.post('/dialog', (req, res) => {
            //Retrieve query text
            let query = req.body.text;
            //Convert audio file to text
            this.stt.stt(query, 'LINEAR16')
            .then((text) => {
                //Send Query to dialogflow
                this.nlp.resolveQuery(text, (msg) => {
                    let result = {
                        fulfillmentText: msg.fulfillmentText,
                        fields: msg.parameters.fields,
                        intent: msg.intent.displayName
                    }
                    //Create answer audio file
                    this.tts.tts(result.fulfillmentText);
                    console.log(result);
                    res.send(result);
                });
            });
        });

        app.post('/dialog_v2', (req, res) => {
            let query = req.body.text;
            this.stt.stt(query, 'LINEAR16')
            .then((text) => {
                this.nlp.dflowProcessing(text)
                .then((msg) => {
                    let result = {
                        fulfillmentText: msg.fulfillmentText,
                        fields: msg.parameters.fields,
                        intent: msg.intent.displayName
                    }
                    this.tts.tts(result.fulfillmentText);
                    console.log(result);
                    res.send(result);
                });
            });
        });

        //Check that a POST request works
        app.post('/test', (req, res) => {
            res.send("POST is working!")
        });

        //Send in a file, then convert file to text, send through dialogflow, then return an answer while creating an answer audio file that is stored on the server
        app.post('/upload_file',this.uploadDisk.any(), (req, res) => {
            console.log('file disk uploaded');
            console.log('filename: ' + req.files[0].filename);
            //res.send('file disk upload success');
            //Get the original name of the file that was sent
            let query = req.files[0].filename;
            //Convert audio file to text
            this.stt.stt(query, 'LINEAR16')
            .then((text) => {
                //Send text to dialogflow
                this.nlp.resolveQuery(text, (msg) => {
                    let result = {
                        fulfillmentText: msg.fulfillmentText,
                        fields: msg.parameters.fields,
                        //intent: mfame
                        intent: msg.intent.displayName
                    }
                    this.tts.tts(result.fulfillmentText);
                    console.log(result);
                    res.send(result);
                });
            });
        });

         //Send in a file, then convert file to text, send through dialogflow, then return an answer while creating an answer audio file that is stored on the server
        app.post('/upload_file_v3',this.uploadDisk.any(), (req, res) => {
            console.log('file disk uploaded');
            console.log('filename: ' + req.files[0].filename);
            let filePathIn = "./audio/"+req.files[0].filename
            let filePathOut = "./audio/Converted_audio.wav";

            Promise.resolve()
                .then(() => {
                    return linear16(filePathIn, filePathOut);
                })
                .then(() => {
                    this.stt.stt(filePathOut)
                    .then(text => {
                        console.log('Text: ', text);
                        if (text == ""){
                            text = "Hi"
                        }
                        this.nlp.resolveQuery(text, (msg) => {
                            let result = {
                                fulfillmentText: msg.fulfillmentText,
                                fields: msg.parameters.fields,
                                intent: msg.intent.displayName
                            }
                            this.tts.tts(result.fulfillmentText, () => {
                                console.log(result);
                                console.log("Result: " + result.fulfillmentText);
                                /*
                                this.tts.writeFile('./outputAudio/intent.txt', result.intent)
                                this.tts.appendFile('./outputAudio/intent.txt', "-"+result.fulfillmentText)
                                this.tts.appendFile('./outputAudio/intent.txt', "-"+result.fields)
                                */
                                this.jsonObject["fulfillmentText"]=result.fulfillmentText;
                                this.jsonObject["fields"]=result.fields;
                                this.jsonObject["intent"]=result.intent;


                              
                                res.sendFile(__dirname + "/outputAudio/" + "output.mp3");
                            });
                        })
                    });
                })        
        });

        /*app.get('/get_intent',function(req,res){
            fs.readFile(__dirname + '/outputAudio/intent.txt', 'utf8', function (err,data) {
                if (err) {
                  return console.log(err);
                }
                console.log(data);
                res.send(data)
              });

          
          });*/
        app.get('/get_intent', (req,res) => {
        res.send(this.jsonObject)
                   
        });
    }

    //Create new instances of the language classes
    initClasses() {
        //Project Variables
        //this.pv = new PV('hilda-lpjuyr', '../hilda-dialogflow-credentials.json', 'delta-exchange-279407', '../hilda-gcloud-credentials.json')
        this.pv = new PV('norsk-hilda-hbqgtg', '../norsk-hilda.json', 'delta-exchange-279407', '../hilda-gcloud-credentials.json')

        //let language = 'en-US';
        let language = 'no';

        //Speech To Text
        this.stt = new STT(language, this.pv.getGCloudProjectName(), this.pv.getGCloudCreds());
        //Text To Speech
        this.tts = new TTS(language, this.pv.getGCloudProjectName(), this.pv.getGCloudCreds());
        //Natural Language Processing
        this.nlp = new NLP(language, this.pv.getDflowProjectName(), this.pv.getDflowCreds());
    }
}

//Run Server class
new Server;
