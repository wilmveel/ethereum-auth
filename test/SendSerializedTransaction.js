var assert = require('assert');
var Web3 = require('web3');

var contracts = require('../src/contracts');

var ethereumjsUtil = require('ethereumjs-util');

describe('Contracts', function () {

    this.timeout(1000000);

    var web3 = new Web3();

    var defaultProvider = new web3.providers.HttpProvider("http://128.199.53.68:8545")

    web3.setProvider(defaultProvider);
    web3.eth.defaultAccount = web3.eth.coinbase;

    var compiled = web3.eth.compile.solidity(contracts);

    it('should send serialized transaction', function (done) {

        var abi = compiled.User.info.abiDefinition;
        var code = compiled.User.code;

        var hash = web3.sha3("willem:123456");
        var privateKey = new Buffer(hash, 'hex');

        var address = ethereumjsUtil.bufferToHex(ethereumjsUtil.privateToAddress(privateKey));

        var signer = require('../src/signer')(privateKey)

        var data = web3.eth.contract(abi).new.getData({
            from: address,
            gas: 5000000000000000,
            data: code
        });

        var rawTx = {
            nonce: '0x100',
            data: data
        }

        signer.signTransaction(rawTx, function(err, serializedTx){
            web3.eth.sendRawTransaction(serializedTx, function(err, hash) {
                if (!err){
                    console.log(hash);
                    done();
                } else {
                    console.log(err);
                    done();
                }
            });
        });

    });
});