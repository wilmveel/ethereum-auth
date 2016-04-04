var assert = require('assert');


var Web3 = require('web3');

describe('BlockChain', function () {
    describe('Create contract', function () {
        it('should create contract into blockchain', function (done) {
            this.timeout(60000);

            var web3 = new Web3();

            var defaultProvider = new web3.providers.HttpProvider("http://128.199.53.68:8545")

            web3.setProvider(defaultProvider);

            var source = "contract calculation { function multiply(uint a) constant returns(uint d) {return a * 7;}}";

            var compiled = web3.eth.compile.solidity(source);
            var abi = compiled.calculation.info.abiDefinition;
            var code = compiled.calculation.code;

            web3.eth.contract(abi).new({
                from: web3.eth.coinbase,
                gas: 500000,
                data: code
            }, function (err, contract) {
                if (err) {
                    console.log("Contract creation error", err);
                    done(err);
                } else if (contract.address) {
                    console.log("Contract Created", contract.address);
                    assert.equal("49", contract.multiply(7).toString())
                    done();
                }
            });
        });
    });
});