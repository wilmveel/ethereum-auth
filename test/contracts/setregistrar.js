/* 
a global registrar address and abi should be hardcoded 
in the library provided for a private blockchain to 
override the global registrar settings
*/

var assert = require('assert');

var Web3 = require('web3');
//var ethereumjsUtil = require('ethereumjs-util');

//var Watch = require('../../src/watch');
//var Wallet = require('../../src/wallet');

var contracts = require('../../src/contracts');

describe('SetRegistrar', function () {

    this.timeout(100000);

    var DEFAULT_GAS = 5000000;

    //var web3 = new Web3();
    //var watch = new Watch(web3);

    var defaultProvider = new web3.providers.HttpProvider("http://128.199.53.68:8545")

    web3.setProvider(defaultProvider);
    web3.eth.defaultAccount = web3.eth.coinbase;

    var appWallet;

    it('should create the registrar contract and update the web3', function (done) {

        var abi = compiled.Registrar.info.abiDefinition;
        var code = compiled.Registrar.code;

        
        web3.eth.contract(abi).new({
            from: web3.eth.coinbase,
            gas: DEFAULT_GAS,
            data: code
        }, callback);
    


        function callback(err, contract) {
            if (err) {
                console.log("Contract creation error", err);
                done(err);
            } else if (contract.address) {
                console.log("Contract Created", contract.address);
                web3.namereg.global.address = contract.address;
                web3.namereg.global.abi = abi;
                done();
            }
        };
    });
    it('should name a party contract', function(done){
        
        var abi = compiled.Party.info.abiDefinition;
        var code = compiled.Party.code;
        
        web3.eth.contract(abi).new({
            from: web3.eth.coinbase,
            gas: DEFAULT_GAS,
            data: code
        }, callback);
        
        function callback(err, contract) {
            if (err) {
                console.log("Contract creation error", err);
                done(err);
            } else if (contract.address) {
                console.log("Contract Created", contract.address);
                if(web3.namereg.isAvailable){
                    web3.namereg.setPartyName("testparty", contract.address );
                    done();
                }
                else{ 
                    console.log('not available')
                    done();    
                }
                
            }
        }
    })
    it('should return the address given the name', function(done){
        web3.namereg.getAddress("testparty", function(regAddress){
            console.log(regAddress);
            done();
        })
    })
    
});

