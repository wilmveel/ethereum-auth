var assert = require('assert');

var Web3 = require('web3');
var ethereumjsUtil = require('ethereumjs-util');

var secp256k1 = require('secp256k1');
var crypto = require('crypto');

var Watch = require('../src/watch');
var Wallet = require('../src/wallet');

var contracts = require('../src/contracts');

describe('PasswordDelegate', function () {

    this.timeout(1000000);

    var DEFAULT_GAS = 5000000;

    var web3 = new Web3();
    var watch = new Watch(web3);

    var defaultProvider = new web3.providers.HttpProvider("http://128.199.53.68:8545")

    web3.setProvider(defaultProvider);
    web3.eth.defaultAccount = web3.eth.coinbase;

    var compiled = web3.eth.compile.solidity(contracts);


    var passwordDelegateContract;

    var password = new Buffer(web3.sha3('wilm123456'), 'hex');

    var salt = crypto.randomBytes(32);
    console.log('salt:', salt.toString('hex'));

    var response;

    function createPrivateKey(password, salt) {
        if (!salt) return password;
        return new Buffer(web3.sha3(password.toString('hex') + salt.toString('hex')), 'hex');
    }

    it('should quick init', function (done) {

        var abi = compiled.PasswordDelegate.info.abiDefinition;

        web3.eth.contract(abi).at('0x8b98b888d20056b41b15437d20b38a8f5d22e46a', callback);

        function callback(err, contract) {
            if (err) {
                console.log("Contract creation error", err);
                done(err);
            } else if (contract.address) {
                console.log("passwordDelegateContract:", contract.address);
                //passwordDelegateContract = contract;
                done();
            }
        };

    });


    it('should create response', function (done) {

        if(passwordDelegateContract) return done();

        var challenge = crypto.randomBytes(32);
        console.log('challenge:', challenge.toString('hex'));

        var privateKey = createPrivateKey(password, salt);
        console.log('privateKey:', privateKey.toString('hex'));

        var sign = secp256k1.sign(challenge, privateKey);
        console.log(sign);

        var recover = secp256k1.recover(challenge, new Buffer(sign.signature, 'hex'), sign.recovery);
        console.log('recover:', recover.toString('hex'));

        response = ethereumjsUtil.privateToAddress(privateKey);
        console.log('response:', response.toString('hex'));

        done();

    });

    it('should create passwordDelegate contract', function (done) {

        if(passwordDelegateContract) return done();

        var abi = compiled.PasswordDelegate.info.abiDefinition;
        var code = compiled.PasswordDelegate.code;

        web3.eth.contract(abi).new('0x0000000000000000000000000000000000000000', '0x' + response.toString('hex'), '0x' + salt.toString('hex'), {
            gas: DEFAULT_GAS,
            data: code
        }, callback);

        function callback(err, contract) {
            if (err) {
                console.log("Contract creation error", err);
                done(err);
            } else if (contract.address) {
                console.log("passwordDelegateContract:", contract.address);
                passwordDelegateContract = contract;
                done();
            }
        };
    });

    it('should execute validate response', function (done) {

        var salt = new Buffer(passwordDelegateContract.getSalt().slice(2), 'hex');
        console.log('salt:', salt.toString('hex'));

        var challenge = new Buffer(passwordDelegateContract.getChallenge().slice(2), 'hex');
        console.log('challenge:', challenge.toString('hex'));

        var response = new Buffer(passwordDelegateContract.getResponse().slice(2), 'hex');
        console.log('response:', response.toString('hex'));

        var privateKey = createPrivateKey(password, salt);
        var sign = secp256k1.sign(challenge, privateKey);

        var v = sign.recovery + 27;
        var r = '0x' + sign.signature.slice(0, 32).toString('hex');
        var s = '0x' + sign.signature.slice(32, 64).toString('hex');

        console.log(v, r, s);

        var grant = '0x0000000000000000000000000000000000000000';

        passwordDelegateContract.authorize(v, r, s, grant, { gas: DEFAULT_GAS });
        passwordDelegateContract.allEvents().watch(function(err, event){
            if (err) return done(err)

            if(event.event == 'error'){
                console.log('error:', event);
                done();
            }

            if(event.event == 'success'){
                console.log('success:', event);
                done();
            }
        });

    });
});