var assert = require('assert');
var Web3 = require('web3');

var contracts = require('../../src/contracts');

describe('Contracts', function () {

    this.timeout(1000000);

    var DEFAULT_GAS = 500000;

    var web3 = new Web3();

    var defaultProvider = new web3.providers.HttpProvider("http://128.199.53.68:8545")

    web3.setProvider(defaultProvider);
    web3.eth.defaultAccount = web3.eth.coinbase;

    var compiled = web3.eth.compile.solidity(contracts);

    var partyAddress;
    var partyContract;

    function watch(transaction, callback) {
        var filter = web3.eth.filter("latest");
        filter.watch(function (error, log) {
            web3.eth.getTransaction(transaction, function (err, t) {
                if (t.blockHash) {
                    console.log("transaction", t);
                    filter.stopWatching();
                    callback();
                }
            });

        });
    };

    it('should create party contract', function (done) {

        var abi = compiled.Party.info.abiDefinition;
        var code = compiled.Party.code;

        if(partyAddress){
            web3.eth.contract(abi).at(partyAddress, callback);
        }else{
            web3.eth.contract(abi).new({
                from: web3.eth.coinbase,
                gas: DEFAULT_GAS,
                data: code
            }, callback);
        }


        function callback(err, contract) {
            if (err) {
                console.log("Contract creation error", err);
                done(err);
            } else if (contract.address) {
                console.log("Contract Created", contract.address);
                partyAddress = contract.address;
                partyContract = contract;
                done();
            }
        };
    });

    it('should create delegates', function (done) {
       partyContract.enroll("1", {
            gas: DEFAULT_GAS
        }, function (err, transaction) {
            watch(transaction, function () {
                done();
            });
        });
    });

    it('should delete delegates', function (done) {
        partyContract.abandon("1", {
            gas: DEFAULT_GAS
        }, function (err, transaction) {
            watch(transaction, function () {
                done();
            });
        });
    });

});