var assert = require('assert');

var Web3 = require('web3');

var fs = require('fs');
require.extensions['.sol'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

var ethereumAuth = require('../../src/index');
var passwordDelegateServices = ethereumAuth.services.passwordDelegateServices;

describe('services', function () {

    this.timeout(1000000);

    var web3 = new Web3();
    var defaultProvider = new web3.providers.HttpProvider("http://128.199.53.68:8545")

    web3.setProvider(defaultProvider);
    web3.eth.defaultAccount = web3.eth.coinbase;

    var service = passwordDelegateServices(web3);

    var passwordDelegateContract;

    it('should create passwordDelegate contract', function (done) {
        service.create("Willem123", function(err, contract){
            passwordDelegateContract = contract
            done();
        });
    });

    it('should verify passwordDelegate contract', function (done) {
        service.verify(passwordDelegateContract.address, "Willem123", function(err){
            console.log(err);
            done();
        });
    });
});