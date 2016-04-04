var assert = require('assert');
var Web3 = require('web3');

var contracts = require('../src/contracts');

describe('TokenCreator', function () {


    this.timeout(60000);

    var web3 = new Web3();

    var defaultProvider = new web3.providers.HttpProvider("http://128.199.53.68:8545")

    web3.setProvider(defaultProvider);
    web3.eth.defaultAccount = web3.eth.coinbase;

    console.log(contracts);

    var compiled = web3.eth.compile.solidity(contracts);

    var tokenContract;
    var tokenAddress;

    it('should create TokenCreator factory', function (done) {

        var abi = compiled.TokenCreator.info.abiDefinition;
        var code = compiled.TokenCreator.code;

        web3.eth.contract(abi).new({
            gas: 500000,
            data: code
        }, function (err, contract) {
            if (err) {
                console.log("Contract creation error", err);
                done(err);
            } else if (contract.address) {
                console.log("Contract Created", contract.address);
                tokenContract = contract;
                done();
            }
        });
    });

    it('createToken', function (done) {
        tokenAddress = tokenContract.createToken("1");
        console.log("createToken", tokenAddress);
        done();
    });

    it('getName', function (done) {
        var name = tokenContract.getName(tokenAddress);
        console.log("createToken", name);
        done();
    });

    it('changeName', function (done) {
        tokenContract.changeName(tokenAddress, "9");
        done();
    });

    it('getName', function (done) {
        setInterval(function() {
            var name = tokenContract.getNagme(tokenAddress);
            console.log("createToken", name);
            if(name === "9") done();

        }, 3000);
    })

});