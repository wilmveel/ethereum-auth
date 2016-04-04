var assert = require('assert');

var Web3 = require('web3');

var ethereumjsUtil = require('ethereumjs-util');

var secp256k1 = require('secp256k1')

var jwt = require('../src/jwt');

describe('Jwt', function () {

    var expect = "MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgEbVzfPnZPxfAyxqEZV05laAoJAl+/6Xt2O4mOB611sOhRANCAASgFTKjwJAAU95g++/vzKWHkzAVmNMItB5vTjZOOIwnEb70MsWZFIyUFD1P9Gwstz4+akHX7vI8BH6hHmBmfeQl"


    var test = "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEoBUyo8CQAFPeYPvv78ylh5MwFZjTCLQeb042TjiMJxG+9DLFmRSMlBQ9T/RsLLc+PmpB1+7yPAR+oR5gZn3kJQ=="

    var web3 = new Web3();

    var username = 'willem';
    var password = '123456';
    var hash = web3.sha3(username + ":" + password);

    var privateKey = new Buffer(hash, 'hex');
    var publicKey= secp256k1.publicKeyCreate(privateKey);


    it('should create jwt token', function (done) {
        var buffer = new Buffer(expect, 'base64');

        console.log(buffer.length);

        var hash = web3.sha3("willem:123456");
        var privateKey = new Buffer(hash, 'hex');
        console.log(privateKey.toString('base64'));

        done()
    });

});