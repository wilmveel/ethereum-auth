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

    var DEFAULT_GAS = 50000000000000;

    var web3 = new Web3();
    var watch = new Watch(web3);

    var defaultProvider = new web3.providers.HttpProvider("http://128.199.53.68:8545")

    web3.setProvider(defaultProvider);
    web3.eth.defaultAccount = web3.eth.coinbase;

    var compiled = web3.eth.compile.solidity(contracts);

    var wallet;
    var passwordDelegateContract;

    var password = new Buffer(web3.sha3('wilm123456'));

    var challenge;
    var response;

    var privateKey;

    var signature = {};

    function createPrivateKey(challenge, password) {
        return Buffer.concat([
            password.slice(0, 8),
            challenge.slice(8, 16),
            password.slice(24, 32),
            challenge.slice(16, 24)
        ]);

    }

    it('should create create chalange', function (done) {

        challenge = crypto.randomBytes(32);
        console.log('challenge:', challenge.toString('hex'));

        var privateKey = createPrivateKey(challenge, password);
        console.log('privateKey:', privateKey.toString('hex'));

        response = ethereumjsUtil.privateToAddress(privateKey);
        console.log('response:', response.toString('hex'));


        var sign = secp256k1.sign(challenge, privateKey);

        signature.r = sign.signature.slice(0, 32);
        signature.s = sign.signature.slice(32, 64);
        signature.v = sign.recovery + 27;

        console.log(signature);

        var recover = secp256k1.recover(challenge, new Buffer(sign.signature, 'hex'), sign.recovery);

        console.log(response);
        console.log(recover);

        done();

    });

    it('should create a app wallet and transfer 1 ether', function (done) {

        wallet = new Wallet();
        var transaction = web3.eth.sendTransaction({
                from: web3.eth.coinbase,
                to: wallet.address,
                value: web3.toWei(1, "ether")
            }
        );

        watch(transaction, function (err, res) {
            console.log(err, res);
            done();
        })

    });

    it('should create passwordDelegate contract by wallet', function (done) {

        var abi = compiled.PasswordDelegate.info.abiDefinition;
        var code = compiled.PasswordDelegate.code;

        console.log('challenge:', challenge.toString('hex'));

        wallet.eth.contract(abi).new('0x' + challenge.toString('hex'), '0x' + response.toString('hex'), {
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

    it('should execute challenge response', function (done) {

        var lala = passwordDelegateContract.getChallenge();
        console.log('lala:', lala);

        var challenge = new Buffer(passwordDelegateContract.getChallenge().slice(2), 'hex');
        console.log('challenge:', challenge.toString('hex'));

        var privateKey = createPrivateKey(challenge, password);
        var sign = secp256k1.sign(challenge, privateKey);

        var v = sign.recovery + 27;
        var r = sign.signature.slice(0, 32);
        var s = sign.signature.slice(32, 64);

        console.log(v,r,s);

        var validate = passwordDelegateContract.authorize(v, '0x' + r.toString('hex'), '0x' + s.toString('hex'));
        console.log("validate:", validate);

        assert.equal('0x' + response.toString('hex'), validate);

        done();
    });
});