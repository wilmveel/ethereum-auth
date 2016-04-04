var assert = require('assert');

var Web3 = require('web3');

var ethereumjsUtil = require('ethereumjs-util');

var secp256k1 = require('secp256k1')

var jwt = require('../src/jwt');

describe('Jwt', function () {

    var web3 = new Web3();

    var username = 'willem';
    var password = '123456';
    var hash = web3.sha3(username + ":" + password);

    var privateKey = new Buffer(hash, 'hex');
    var publicKey= secp256k1.publicKeyCreate(privateKey);


    it('should create jwt token', function (done) {
        var token = jwt.sign("Hello World", privateKey);

        console.log('token', token);

        var verify = jwt.verify(token, publicKey)
        assert.equal(true, verify);

        done()
    });

});