var assert = require('assert');

var Web3 = require('web3');
var ethereumjsUtil = require('ethereumjs-util');

var Watch = require('../../src/watch');
var Wallet = require('../../src/wallet');

var contracts = require('../../src/contracts');

describe('GrantFlow', function () {

    this.timeout(100000);

    var DEFAULT_GAS = 5000000;

    var web3 = new Web3();
    var watch = new Watch(web3);

    var defaultProvider = new web3.providers.HttpProvider("http://128.199.53.68:8545")

    web3.setProvider(defaultProvider);
    web3.eth.defaultAccount = web3.eth.coinbase;

    var appWallet;

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

});