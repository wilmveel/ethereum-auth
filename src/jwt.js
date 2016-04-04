var Web3 = require('web3');
var secp256k1 = require('secp256k1');
var base64 = {
    encode: function(string){
        return new Buffer(string, 'utf8').toString('base64')
    },
    decode: function(string){
        return new Buffer(string, 'base64').toString('utf8')
    },
}

module.exports = {
    sign: function (payload, privateKey) {
        var web3 = new Web3();
        var header = {
            "alg": "ES256",
            "typ": "JWT"
        };
        var msg = base64.encode(JSON.stringify(header)) + "." + base64.encode(JSON.stringify(payload));

        var hash = web3.sha3(msg);
        var sign = secp256k1.sign(new Buffer(hash, 'hex'), privateKey);

        sign.signature = sign.signature.toString('hex');
        var token = msg + "." + base64.encode(JSON.stringify(sign));

        return token;
    },

    verify: function (token, publicKey) {
        var web3 = new Web3();
        var split = token.split(".");
        var msg = split[0] + "." + split[1];

        var hash = web3.sha3(msg);
        var sign = JSON.parse(base64.decode(split[2]));

        var recover = secp256k1.recover(new Buffer(hash, 'hex'), new Buffer(sign.signature, 'hex'), sign.recovery);

        return Buffer.compare(publicKey, recover) === 0;
    }
};