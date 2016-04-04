

var assert = require('assert');
var Web3 = require('web3');

var contracts = require('../src/contracts');

describe('TokenCreator', function () {


    var hex = "0x57696c6c656d0000000000000000000000000000000000000000000000000000"
    var hex = "0x681f3e6d00000000000000000000000000000000000000000000000000000000"

    it('should create GetterSetterContract', function () {

        var buffer = new Buffer(hex.slice(2), 'hex');
        console.log(buffer);
        console.log(buffer.toString('ascii'));
    });


});