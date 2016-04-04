var assert = require('assert');

var Web3 = require('web3');
var ethereumjsUtil = require('ethereumjs-util');

var Wallet = require('../src/wallet');

describe('Contracts', function () {

    this.timeout(1000000);

    it('should create a wallet with private key', function (done) {

        var wallet = new Wallet();

        console.log(wallet);

        done()
    });

    it('should create contract from wallet', function (done) {

        var web3 = new Web3();

        var hash = web3.sha3("willem:123456");
        var privateKey = new Buffer(hash, 'hex');

        var wallet = new Wallet(privateKey);

        var source = "contract calculation { function multiply(uint a) constant returns(uint d) {return a * 7; } }";

        var compiled = wallet.eth.compile.solidity(source);

        console.log('compiled', compiled);

        var abi = compiled.calculation.info.abiDefinition;
        var code = compiled.calculation.code;

        wallet.eth.contract(abi).new({
            gas: 5000000000000000000000,
            data: code,
            from: ethereumjsUtil.bufferToHex(wallet.address)
        }, function (err, contract) {
            if (err) {
                console.log("Contract creation error", err);
                done(err);
            } else if (contract.address) {
                console.log("Contract Created", contract.address);
                assert.equal("49", contract.multiply(7).toString())
                done();
            }
        });
    });



});