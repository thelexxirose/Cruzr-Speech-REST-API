process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const expect  = require('chai').expect;
const request = require('request');


describe('REST API test', () => {
    it('REST content', (done) => {
        request('https://192.168.1.51:3000', { json:true } , (error, response, body) => {
            expect(body).to.equal('REST is working');
            done();
        });
        
    });
    
    it('REST status', (done) => {
        request('https://192.168.1.51:3000', { json:true } , (error, response, body) => {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });
});