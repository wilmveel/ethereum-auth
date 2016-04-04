var Web3 = require('web3');
var web3 = new Web3();

var defaultProvider = new web3.providers.HttpProvider("http://128.199.53.68:8545")

web3.setProvider(defaultProvider);
web3.eth.defaultAccount = web3.eth.coinbase;

var source = "contract test { function multiply(uint a) constant returns(uint d) {return a * 7;}}";

var compiled = web3.eth.compile.solidity(source);
var abi = compiled.test.info.abiDefinition;
var code = compiled.test.code;

function createContract(callback){
    web3.eth.contract(abi).new({
        from: web3.eth.coinbase,
        gas: 500000,
        data: code
    }, callback);
}

module.exports = createContract;
