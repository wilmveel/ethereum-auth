var assert = require('assert');

var Web3 = require('web3');
var ethereumjsUtil = require('ethereumjs-util');

var Watch = require('../src/watch');
var Wallet = require('../src/wallet');

var Banker = require('../src/banker'); 

var contracts = require('../src/contracts');

describe('controlled funding', function () {
    
    var web3 = new Web3()
    var watch = new Watch(web3)
    
    var defaultProvider = new web3.providers.HttpProvider("http://128.199.53.68:8545")
    
    web3.setProvider(defaultProvider);
    web3.eth.defaultAccount = web3.eth.coinbase;
    
    var compiled = web3.eth.compile.solidity(contracts)
    
    var bankerWallet;
    var otherWallet;
    
    var banker;
    
    var bankBalance;
    
    it('should create a bankers wallet and transfer 1 ether', function(){
        bankerWallet = new Wallet()
        var transaction = web3.eth.sendTransaction({
            from: web3.eth.coinbase,
            to: bankerWallet.address,
            value: web3.toWei(1, "ether")
        })
        console.log(transaction)
        
        watch(transaction, function(err, res){
            console.log(err, res)
            done()
        })
        
    })
    it('should create another wallet and transfer 1 ether', function(){
        otherWallet = new Wallet()
        var transaction = web3.eth.sendTransaction({
            from: web3.eth.coinbase,
            to: otherWallet.address,
            value: web3.toWei(1, "ether")
        })
        console.log(transaction)
        
        watch(transaction, function(err, res){
            console.log(err, res)
            done()
        })
    })
    it('should create a banker and a bank', function(){
        
        
        var abi = compiled.Bank.info.abiDefinition
        var code = compiled.Bank.code;
        console.log('and the abi is', abi)
        bankerWallet.eth.contract(abi).new(  {
            gas:50000000000000000000,
            data: code
        }, function(err, contract){
            if (err) {
                console.log("Contract creation error", err);
                done(err);
            } else if (contract.address) {
                console.log("Contract Created", contract.address);
                
                banker = new Banker( bankerWallet, contract.address, abi);
                done();
            }
        })
    })
    it('should send 1 ether to the bank', function(){
        var transaction = web3.eth.sendTransaction({
            from: web3.eth.coinbase,
            to: banker.bank,
            value: web3.toWei(1, "ether")
        })
        console.log(transaction)
        
        watch(transaction, function(err, res){
            console.log(err, res)
            bankBalance = web3.eth.getBalance(banker.bank).toNumber();
            done()
        })
    })
    it('the otherWallet should send a transaction', function(){
        var abi = compiled.Grant.info.abiDefinition
        var code = compiled.Grant.code
        otherWallet.eth.contract(abi).new({
            gas: 50000000000000000000000,
            data: code
        }, function (err, contract){
             if (err) {
                console.log("Contract creation error", err);
                done(err);
            } else if (contract.address) {
                console.log("Contract Created", contract.address);
                
                done();
            }
        })
    })
    it('should refund the other wallet after a transaction', function(){  
        var filter = new filter({address:banker.bank})
        filter.watch(function(err, log){
            web3.eth.getBalance(banker.bank, 'latest', function(err, res){
                if(bankBalance != res.toNumber()){
                    filter.stopWatching;
                    console.log(web3.eth.getBalance(otherWallet.address).toString());
                    done();
                }
            })
        })
        
        
        
    })
})