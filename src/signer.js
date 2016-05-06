var ethereumjsTx = require('ethereumjs-tx');
var ethereumjsUtil = require('ethereumjs-util');

module.exports = function (privateKey) {

    return {

        hasAddress: function (address, callback) {
            callback(null, true)
        },

        signTransaction: function (tx_params, callback) {

            console.log(tx_params);

            tx_params.gasPrice = '0xBA43B7400';
            tx_params.gasLimit = '0x50000';

            var tx = new ethereumjsTx(tx_params);
            tx.sign(privateKey);

            var buffer = new Buffer(tx.serialize());
            console.log(buffer.toString('hex'));
            var signedTx = ethereumjsUtil.bufferToHex(buffer);

            callback(null, ethereumjsUtil.stripHexPrefix(signedTx));
        }
    }
};