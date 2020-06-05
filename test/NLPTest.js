process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const NLP = require('../NLP');
const chai  = require('chai');
const chaiAsPromised = require('chai-as-promised');
const dotenv = require('dotenv');

chai.use(chaiAsPromised);

dotenv.config();

let nlp = new NLP('en-US');

describe('NLP test', () => {
    it('dflowProcessing test', (done) => {
        let res = Promise.resolve(nlp.dflowProccessing('API TEST')).then((res) => {
            console.log(typeof(res));
            return res;
        }).catch(error => {
            console.log(error);
        });
        chai.expect(res).to.be.a('promise');
        done();
    });
    
    it('resolveQuery test', (done) => {
        nlp.resolveQuery('API TEST', (msg) => {
            chai.expect(msg.fulfillmentText).to.equal('API working normally');
        })
        done();
    });
});