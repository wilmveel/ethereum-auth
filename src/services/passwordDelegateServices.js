var assert = require('assert');

var crypto = require('crypto');
var secp256k1 = require('secp256k1');

var ethereumjsUtil = require('ethereumjs-util');

module.exports = function(web3){

    var contracts = require('../contracts');
    var compiled = web3.eth.compile.solidity(contracts);

    var DEFAULT_GAS = 500000;

    function createPrivateKey(password, salt) {
        return new Buffer(web3.sha3(password.toString('hex') + salt.toString('hex')), 'hex');
    }

    return {

        create: function(password, callback){

            var salt = crypto.randomBytes(32);
            var challenge = crypto.randomBytes(32);

            var privateKey = createPrivateKey(password, salt);
            var sign = secp256k1.sign(challenge, privateKey);
            var recover = secp256k1.recover(challenge, new Buffer(sign.signature, 'hex'), sign.recovery);
            var response = ethereumjsUtil.privateToAddress(privateKey);

            //assert.equal(recover.toString('hex'), response.toString('hex'));

            var abi = compiled.PasswordDelegate.info.abiDefinition;
            var code = compiled.PasswordDelegate.code;

            web3.eth.contract(abi).new('0x' + response.toString('hex'), '0x' + salt.toString('hex'), {
                gas: DEFAULT_GAS,
                data: code
            }, function (err, contract) {
                if (err) {
                    console.log("Contract creation error", err);
                    callback(err);
                } else if (contract.address) {
                    console.log("passwordDelegateContract:", contract.address);
                    passwordDelegateContract = contract;
                    callback(null, contract);
                }
            });

        },

        verify: function(address, password, callback){

            var abi = compiled.PasswordDelegate.info.abiDefinition;

            web3.eth.contract(abi).at(address, function (err, contract) {
                if (err) {
                    console.log("Contract creation error", err);
                    callback(err);
                } else if (contract.address) {

                    var salt = new Buffer(contract.getSalt().slice(2), 'hex');
                    var challenge = new Buffer(contract.getChallenge().slice(2), 'hex');

                    var privateKey = createPrivateKey(password, salt);
                    var sign = secp256k1.sign(challenge, privateKey);

                    var v = sign.recovery + 27;
                    var r = '0x' + sign.signature.slice(0, 32).toString('hex');
                    var s = '0x' + sign.signature.slice(32, 64).toString('hex');

                    console.log(v, r, s);

                    var grant = '0x0000000000000000000000000000000000000000';

                    contract.authorize(v, r, s, grant, {gas: DEFAULT_GAS});
                    contract.allEvents().watch(function (err, event) {
                        if (err) return done(err);

                        assert.equal('success', event.event)
                        callback(null, contract);

                    });
                }
            });
        }
    }

};