var assert = require('assert');

var Web3 = require('web3');

var secp256k1 = require('secp256k1')

var ethereumjsUtil = require('ethereumjs-util');

describe('Jwt', function () {

    var web3 = new Web3();

    var username = 'willem';
    var password = '123456';
    var hash = web3.sha3(username + ":" + password);

    var privateKey = new Buffer(hash, 'hex');
    var publicKey = ethereumjsUtil.privateToPublic(privateKey);

    var address = ethereumjsUtil.privateToAddress(privateKey);

    it('should create jwt token', function (done) {

        var msg = new Buffer(web3.sha3("Dit is een token"), 'hex');

        var sigObj = secp256k1.sign(msg, privateKey);
        console.log(sigObj);

        var publicKeyCreate = secp256k1.publicKeyCreate(privateKey)
        console.log('publicKeyCreate', publicKeyCreate);

        var publicKeyConvert = secp256k1.publicKeyConvert(address, false)
        console.log('publicKeyConvert', publicKeyConvert);

        console.log(publicKey);
        console.log(address);


        console.log(secp256k1.publicKeyVerify(publicKeyConvert));

        //console.log(secp256k1.verify(msg, sigObj.signature, address))

        done();

    });

});