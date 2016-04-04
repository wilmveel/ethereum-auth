var assert = require('assert');

var Web3 = require('web3');
var ethereumjsUtil = require('ethereumjs-util');

var Watch = require('../src/watch');
var Wallet = require('../src/wallet');

var contracts = require('../src/contracts');

describe('GrantFlow', function () {

    this.timeout(1000000);

    var web3 = new Web3();
    var watch = new Watch(web3);

    var defaultProvider = new web3.providers.HttpProvider("http://128.199.53.68:8545")

    web3.setProvider(defaultProvider);
    web3.eth.defaultAccount = web3.eth.coinbase;

    var compiled = web3.eth.compile.solidity(contracts);

    var appWallet;
    var userWallet;

    var grantContract;

    it('should create a app wallet and transfer 1 ether', function (done) {

        appWallet = new Wallet();
        var transaction = web3.eth.sendTransaction({
                from: web3.eth.coinbase,
                to: ethereumjsUtil.bufferToHex(appWallet.address),
                value: web3.toWei(1, "ether")
            }
        )
        console.log(transaction);

        watch(transaction, function (err, res) {
            console.log(err, res);
            done();
        })

    });

    it('should create a user wallet and transfer 1 ether', function (done) {

        userWallet = new Wallet();
        var transaction = web3.eth.sendTransaction({
                from: web3.eth.coinbase,
                to: ethereumjsUtil.bufferToHex(userWallet.address),
                value: web3.toWei(1, "ether")
            }
        )
        console.log(transaction);

        watch(transaction, function (err, res) {
            console.log(err, res);
            done();
        })

    });

    it('app creates grant contract', function (done) {

        var abi = compiled.Grant.info.abiDefinition;
        var code = compiled.Grant.code;

        appWallet.eth.contract(abi).new({
            gas: 5000000000000000000000,
            data: code,
            from: ethereumjsUtil.bufferToHex(appWallet.address)
        }, function (err, contract) {
            if (err) {
                console.log("Contract creation error", err);
                done(err);
            } else if (contract.address) {
                console.log("Contract Created", contract.address);
                grantContract = contract.address;
                done();
            }
        });
    });

    it('app creates grant contract', function (done) {

        var abi = compiled.Grant.info.abiDefinition;
        var code = compiled.Grant.code;

        userWallet.eth.contract(abi).at(grantContract, function (err, contract) {
            if (err) {
                console.log("Contract creation error", err);
                done(err);
            } else if (contract.address) {
                console.log("Contract Created", contract.address);
                grantContract = contract.address;
                done();
            }
        });
    });


});