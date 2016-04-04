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

    var source = "" +
        "contract test { " +
        "   address owner;" +
        "   function test() { owner = msg.sender; }" +
        "   function hello() constant returns(string w) {" +
        "       if (msg.sender != owner) return; " +
        "       return 'World';" +
        "   } " +
        "}";

    var compiled = web3.eth.compile.solidity(source);
    var abi = compiled.test.info.abiDefinition;
    var code = compiled.test.code;


    describe('Test private method', function () {
        it('should return "World" only for creator of the contract', function (done) {
            this.timeout(60000);
            web3.eth.defaultAccount = address;
            web3.eth.contract(abi).new({
                gas: 500,
                data: code
            }, function (err, contract) {
                if (err) {
                    console.log("Contract creation error", err);
                    done(err);
                } else if (contract.address) {
                    console.log("Contract Created", contract.address);
                    contract.hello(function(err, res){
                        if(err) console.error(err);
                        console.log("Contract hello()", res);
                        assert.equal(res.toString(), "World");
                        done();
                    });
                }
            });
        });

        it('should return "" when other users of the contract', function (done) {
            this.timeout(60000);
            web3.eth.defaultAccount = web3.eth.coinBase;
            web3.eth.contract(abi).new({
                gas: 500,
                data: code,
                from: address
            }, function (err, contract) {
                if (err) {
                    console.log("Contract creation error", err);
                    done(err);
                } else if (contract.address) {
                    console.log("Contract Created", contract.address);
                    contract.hello(function(err, res){
                        if(err) console.error(err);
                        console.log("Contract hello()", res);
                        assert.equal(res.toString(), "")
                        done();
                    });
                }
            });
        });
    });
});