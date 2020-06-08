const https = require('https');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const multer = require('multer');

const NLP = require('./NLP');
const STT = require('./STT');
const TTS = require('./TTS');


class Server {
    constructor() {
        this.storage;
        this.uploadDisk;
        this.config();
        this.initClasses();
        this.initRoutes();
        this.startHttp();
    }

    startHttps() {
        https.createServer({
            key: fs.readFileSync('cruzr-gateway-sha256.key'),
            cert: fs.readFileSync('cruzr-gateway-sha256.crt')
        }, app).listen(port, () => {
            console.log('Listening on port: ' + port);
        });
        
    }

    startHttp() {
        app.listen(port, () => {
            console.log('Listening on port: ' + port);
        });
    }

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

    initRoutes() {
        app.get('/', (req, res) => {
            res.send('REST is working');
        });
        
        app.post('/dialogflowMessage', (req, res) => {
            var query = req.body.text;
            console.log('dialogflowMessage query: ' + query);
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
        
        app.post('/dialog', (req, res) => {
            let query = req.body.text;
            this.stt.stt(query, 'LINEAR16')
            .then((text) => {
                this.nlp.resolveQuery(text, (msg) => {
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

        app.post('/test', (req, res) => {
            res.send("POST is working!")
        });

        app.post('/upload_file',this.uploadDisk.any(), (req, res) => {
            console.log('file disk uploaded');
            console.log('filename: ' + req.files[0].originalname);
            //res.send('file disk upload success');
            let query = req.files[0].originalname;
            this.stt.stt(query, 'LINEAR16')
            .then((text) => {
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
                    this.tts.tts(result.fulfillmentText);
                    console.log(result);
                    res.send(result);
                });
            });
            //res.send('hello');
        });


    }

    initClasses() {
        let language = 'en-US'
        this.stt = new STT(language);
        this.tts = new TTS(language);
        this.nlp = new NLP(language);
    }
}

new Server;






