//Initialize packages
const https = require('https');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const multer = require('multer');

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
        app.use(bodyParser.urlencoded({ extended: false }));
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
        app.get('/', (req, res) => {
            res.send('REST is working');
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

        //Send in a file, then convert file to text, send through dialogflow, then return an answer while creating an answer sound file that is stored on the server
        app.post('/upload_file',this.uploadDisk.any(), (req, res) => {
            console.log('file disk uploaded');
            console.log('filename: ' + req.files[0].originalname);
            //res.send('file disk upload success');
            //Get the original name of the file that was sent
            let query = req.files[0].originalname;
            //Convert audio file to text
            this.stt.stt(query, 'LINEAR16')
            .then((text) => {
                //Send text to dialogflow
                this.nlp.resolveQuery(text, (msg) => {
                    let result = {
                        fulfillmentText: msg.fulfillmentText,
                        fields: msg.parameters.fields,
                        intent: mfame
                    }
                    this.tts.tts(result.fulfillmentText);
                    console.log(result);
                    res.send(result);
                });
            });
            //res.send('hello');
        });


        app.post('/upload_file_v2',this.uploadDisk.any(), (req, res) => {
            console.log('file disk uploaded');
            console.log('filename: ' + req.files[0].originalname);
            //res.send('file disk upload success');
            let query = req.files[0].originalname;
            this.stt.stt(query, 'LINEAR16')
            .then((text) => {
                this.nlp.dflowProcessing(text)
                .then((msg) => {
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
            //res.send('hello');
        });


    }

    //Create new instances of the language classes
    initClasses() {
        //Project Variables
        this.pv = new PV('hilda-lpjuyr', '../hilda-dialogflow-credentials.json', 'delta-exchange-279407', 'hilda-gcloud-credentials.json')
        let language = 'en-US';
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






