var assert = require('assert');

var Web3 = require('web3');
var ethereumjsTx = require('ethereumjs-tx');
var ethereumjsUtil = require('ethereumjs-util');
var HookedWeb3Provider = require('hooked-web3-provider');

describe('BlockChain', function () {

    var web3 = new Web3();

    var username = 'willem';
    var password = '123456';
    var hash = web3.sha3(username + ":" + password);
    var privateKey = new Buffer(hash, 'hex');

    var address = ethereumjsUtil.bufferToHex(ethereumjsUtil.privateToAddress(privateKey));

    var hookedWeb3Provider = new HookedWeb3Provider({
        host: "http://128.199.53.68:8545",
        transaction_signer: require('../src/signer')(privateKey)
    });

    web3.setProvider(hookedWeb3Provider);

    var source = "contract calculation { function multiply(uint a) constant returns(uint d) {return a * 7; } }";

    var compiled = web3.eth.compile.solidity(source);
    var abi = compiled.calculation.info.abiDefinition;
    var code = compiled.calculation.code;


    describe('Create contract from wallet', function () {

        it('should create contract into blockchain from wallet', function (done) {
            this.timeout(60000);
            web3.eth.contract(abi).new({
                gas: 5000000000000000000000,
                data: code,
                from: address
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
});