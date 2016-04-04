var crypto = require('crypto');

var ethereumjsTx = require('ethereumjs-tx');
var ethereumjsUtil = require('ethereumjs-util');

var Web3 = require('web3');
var HookedWeb3Provider = require('hooked-web3-provider');

module.exports =  function(privateKey){

    if(!privateKey)
        privateKey = crypto.randomBytes(32);

    var address = ethereumjsUtil.privateToAddress(privateKey);

    var web3 = new Web3();

    var signer = require('./signer')(privateKey);

    var hookedWeb3Provider = new HookedWeb3Provider({
        host: "http://128.199.53.68:8545",
        transaction_signer: signer
    });

    web3.setProvider(hookedWeb3Provider);
    web3.eth.defaultAccount = ethereumjsUtil.bufferToHex(address);

    return {
        address: ethereumjsUtil.bufferToHex(address),
        eth: web3.eth
    }


};