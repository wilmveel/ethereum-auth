var assert = require('assert');
var Web3 = require('web3');

var contracts = require('../src/contracts');

describe('Contracts', function () {

    this.timeout(1000000);

    var web3 = new Web3();

    var defaultProvider = new web3.providers.HttpProvider("http://128.199.53.68:8545")

    web3.setProvider(defaultProvider);
    web3.eth.defaultAccount = web3.eth.coinbase;

    var compiled = web3.eth.compile.solidity(contracts);

    var userAddress = '0xacadcd31b076ca2fc0e9269065cd06c52e1fe276';
    var userContract;

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

    it('should create user contract', function (done) {

        var abi = compiled.User.info.abiDefinition;
        var code = compiled.User.code;

        if(userAddress){
            web3.eth.contract(abi).at(userAddress, callback);
        }else{
            web3.eth.contract(abi).new({
                from: web3.eth.coinbase,
                gas: 5000000000000000,
                data: code
            }, callback);
        }


        function callback(err, contract) {
            if (err) {
                console.log("Contract creation error", err);
                done(err);
            } else if (contract.address) {
                console.log("Contract Created", contract.address);
                userAddress = contract.address;
                userContract = contract;
                done();
            }
        };
    });

    it('should create delegates', function (done) {
        var user = userContract.createDelegate("1", {
            gas: 5000000000000000
        }, function (err, transaction) {
            watch(transaction, function () {
                done();
            });
        });
    });

    it('should delete delegates', function (done) {
        var user = userContract.deleteDelegate("1", {
            gas: 5000000000000000
        }, function (err, transaction) {
            watch(transaction, function () {
                done();
            });
        });
    });

});