var assert = require('assert');
var Web3 = require('web3');

var contracts = require('../src/contracts');

describe('Contracts', function () {

    this.timeout(1000000);

    var web3 = new Web3();

    var defaultProvider = new web3.providers.HttpProvider("http://128.199.53.68:8545")

    web3.setProvider(defaultProvider);
    web3.eth.defaultAccount = web3.eth.coinbase;

    console.log(contracts);

    var compiled = web3.eth.compile.solidity(contracts);

    var userAddress;
    var userFactoryAddress = "0xe0a98cee10dd9e44dc17d7a00532988a941ba8ad";
    var userFactoryContract;

    it('should create contract factory', function (done) {

        var abi = compiled.UserFactory.info.abiDefinition;
        var code = compiled.UserFactory.code;

        web3.eth.contract(abi).at(userFactoryAddress, callback);

        function callback(err, contract) {
            if (err) {
                console.log("Contract creation error", err);
                done(err);
            } else if (contract.address) {
                console.log("Contract Created", contract.address);
                userFactoryContract = contract;
                done();
            }
        };
    });

    it('should create user by factory', function (done) {

        var user = userFactoryContract.createUser("willem", {
            gas: 50000000
        }, function (err, res) {
            console.log("Contract creation error", err);
            console.log("res", res);


            var filter = web3.eth.filter("latest");
            filter.watch(function (error, log) {

                console.log("log", log);

                web3.eth.getTransaction(res, function (err, transaction) {
                    if (transaction.blockHash) {
                        console.log("transaction", transaction);
                        filter.stopWatching()
                        done()
                    }
                });

            });
        })

    });


    it('should find user by factory', function (done) {

        var getUser = userFactoryContract.getUser().toString();
        userAddress = getUser;
        console.log("getUser", getUser);

        var findUser = userFactoryContract.findUser().toString();
        console.log("findUser", findUser);
        if (findUser === "0x77696c6c656d0000000000000000000000000000000000000000000000000000") done();

    });

    it('should find user by address', function (done) {

        if (!userAddress) userAddress = "0x498074a7707b9b60eab57e4ebc84b5a045656734";

        var abi = compiled.User.info.abiDefinition;

        web3.eth.contract(abi).at(userAddress, callback);

        function callback(err, contract) {
            if (err) {
                console.log("Contract creation error", err);
                done(err);
            } else if (contract.address) {
                var getUsername = contract.getUsername(function (err, res) {
                    console.log("findUser", res);
                    done();
                });
            }
        };
    });


});