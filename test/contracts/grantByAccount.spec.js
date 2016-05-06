var assert = require('assert');

var Web3 = require('web3');
var ethereumjsUtil = require('ethereumjs-util');

var Watch = require('../../src/watch');
var Wallet = require('../../src/wallet');

var contracts = require('../../src/contracts');

describe('GrantFlow', function () {

    this.timeout(1000000);

    var DEFAULT_GAS = 50000;

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
                to: appWallet.address,
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
                to: userWallet.address,
                value: web3.toWei(1, "ether")
            }
        )
        console.log(transaction);

        watch(transaction, function (err, res) {
            console.log(err, res);
            done();
        })

    });

    it('should create grant contract by app', function (done) {

        var abi = compiled.Grant.info.abiDefinition;
        var code = compiled.Grant.code;

        appWallet.eth.contract(abi).new({
            gas: DEFAULT_GAS,
            data: code
        }, function (err, contract) {
            if (err) {
                console.log("Contract creation error", err);
                done(err);
            } else if (contract.address) {
                console.log("Contract Created", contract.address);
                grantContract = contract;
                done();
            }
        });
    });

    it('should authorize grant contract by user', function (done) {

        var abi = compiled.Grant.info.abiDefinition;
        var code = compiled.Grant.code;

        userWallet.eth.contract(abi).at(grantContract.address, function (err, contract) {
            if (err) {
                console.log("Contract creation error", err);
                done(err);
            } else if (contract.address) {
                console.log("Contract Fetch", contract.address);
                contract.authorize({
                    gas: DEFAULT_GAS
                }, function (err, transaction) {
                    console.log(err, transaction);
                    watch(transaction, function (err, res) {
                        console.log(err, res);
                        done();
                    });
                });
            }
        });
    });


    it('should revoke grant contract', function (done) {

        var abi = compiled.Grant.info.abiDefinition;

        web3.eth.contract(abi).at(grantContract.address, function (err, contract) {
            if (err) {
                console.log("Contract creation error", err);
                done(err);
            } else if (contract.address) {
                console.log("Contract Fetch", contract.address);
                contract.revoke(function (err, res) {
                    console.log('state', res);
                    done();
                });
            }
        });
    });

    it('should be removed', function (done) {

        var abi = compiled.Grant.info.abiDefinition;

        web3.eth.contract(abi).at(grantContract.address, function (err, contract) {
            if (err) {
                console.log("Contract creation error", err);
                done(err);
            } else if (contract.address) {
                console.log("Contract Fetch", contract.address);
                contract.revoke(function (err, res) {
                    console.log('state', res);
                    done();
                });
            }
        });
    });


});