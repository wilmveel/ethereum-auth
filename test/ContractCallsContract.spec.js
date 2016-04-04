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



    var hookedWeb3Provider = new HookedWeb3Provider({
        host: "http://128.199.53.68:8545",
        transaction_signer: signer
    });

    web3.setProvider(hookedWeb3Provider);
    web3.eth.defaultAccount = web3.eth.coinbase;

    var source = "" +
        "contract calculation { " +
        "   function multiply(uint a) constant returns(uint d) {return a * 7;}" +
        "} " +
        "contract caller{ " +
        "   function call (address contractAddress) constant returns (uint d) { return calculation(contractAddress).multiply(4); } " +
        "}";

    var compiled = web3.eth.compile.solidity(source);

    var abi = compiled.caller.info.abiDefinition;
    var code = compiled.caller.code;

    describe('Create contract from wallet', function () {
        it('should create contract into blockchain', function (done) {
            this.timeout(60000);
            web3.eth.contract(abi).new({
                from: "0xf4c0db7c7719c19d1e27caa6aa40d219883b697a",
                gas: 500000,
                data: code
            }, function (err, contract) {
                if (err) {
                    console.log("Contract creation error", err);
                    done(err);
                } else if (contract.address) {
                    console.log("Contract Created", contract.address);

                    contract.call("0x89a679f2e78dde539009c2dc3a87528a65966ddc", function(err, res){
                        assert.equal("28", res.toString());
                        done();
                    })


                }
            });
        });
    });
});