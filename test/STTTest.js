process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const STT = require('../STT');
const chai  = require('chai');
const dotenv = require('dotenv');

dotenv.config();

let stt = new STT('en-US');
let expect = chai.expect;

describe('STT test', () => {
    
    it('stt method: wav format', async () => {
        let res = await stt.stt('recording.wav', 'LINEAR16');
        expect(res).to.equal('hello my name is Cory');
    }).timeout(5000);
    it('stt method: mp3 format', async () => {
        await stt.mp3Converter('Recording.mp3');
        let res = await stt.stt('test.wav', 'LINEAR16');
        expect(res).to.equal('hello my name is Cory');
    }).timeout(5000);
});