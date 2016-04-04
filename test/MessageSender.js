var assert = require('assert');

var Web3 = require('web3');
var ethereumjsTx = require('ethereumjs-tx');
var ethereumjsUtil = require('ethereumjs-util');
var HookedWeb3Provider = require('hooked-web3-provider');

describe('BlockChain', function () {

    var web3 = new Web3();

    var web3 = new Web3();

    var defaultProvider = new web3.providers.HttpProvider("http://128.199.53.68:8545")

    web3.setProvider(defaultProvider);
    web3.eth.defaultAccount = web3.eth.coinbase;

    var source = "" +
        "contract sender { " +
        "   function send() constant returns(address) {return msg.sender;}" +
        "} " +
        "contract caller{ " +
        "   function call (address contractAddress) constant returns (address) { return sender(contractAddress).send(); } " +
        "}";

    var compiled = web3.eth.compile.solidity(source);



    describe('Forwarding contract who is the sender', function () {

        this.timeout(60000000);

        var senderAddress;
        var callerAddress;

        var senderContranct;
        var callerContranct;

        it('should create send contract', function (done) {

            var abi = compiled.sender.info.abiDefinition;
            var code = compiled.sender.code;

            web3.eth.contract(abi).new({
                gas: 500000,
                data: code
            }, function (err, contract) {
                if (err) {
                    console.log("Contract creation error", err);
                    done(err);
                } else if (contract.address) {
                    senderContract = contract
                    senderAddress = contract.address
                    done()
                }
            });
        });

        it('should create caller contract', function (done) {

            var abi = compiled.caller.info.abiDefinition;
            var code = compiled.caller.code;

            web3.eth.contract(abi).new({
                gas: 500000,
                data: code
            }, function (err, contract) {
                if (err) {
                    console.log("Contract creation error", err);
                    done(err);
                } else if (contract.address) {
                    callerContract = contract
                    callerAddress = contract.address
                    done()
                }
            });
        });

        it('should call', function (done) {
            console.log(web3.eth.coinbase);
            console.log(senderAddress);
            console.log(callerAddress);
            console.log(senderContract.send());
            console.log(callerContract.call(senderAddress));

            assert.equal(web3.eth.coinbase, senderContract.send())
            assert.equal(callerAddress, callerContract.call(senderAddress))
            done();
        });

    });
});