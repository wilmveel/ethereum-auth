var assert = require('assert');
var Web3 = require('web3');

var contracts = require('../src/contracts');

describe('Contracts', function () {

    this.timeout(60000);

    var web3 = new Web3();

    var defaultProvider = new web3.providers.HttpProvider("http://128.199.53.68:8545")

    web3.setProvider(defaultProvider);
    web3.eth.defaultAccount = web3.eth.coinbase;

    console.log(contracts);

    var compiled = web3.eth.compile.solidity(contracts);
    var abi = compiled.User.info.abiDefinition;
    var code = compiled.User.code;

    it('should create contract into blockchain', function (done) {


        web3.eth.contract(abi).new(1,{
            gas: 500000,
            data: code
        }, function (err, contract) {
            if (err) {
                console.log("Contract creation error", err);
                done(err);
            } else if (contract.address) {
                console.log("Contract Created", contract.address);
                assert.equal("1", contract.getUsername().toString())
                done();
            }
        });
    });

});