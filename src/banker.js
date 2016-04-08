Web3 = require('web3')
web3 = new Web3()
provider = require('hooked-web3-provider')

watchTx = require('./watch')

module.exports = function(wallet, bankAddress, abi){
    if(!wallet) throw Exception;
    if(!bankAddress) throw Exception;
    console.log(bankAddress)
    var filter = wallet.eth.filter("latest");
        filter.watch(function (error, log) {
            wallet.eth.getTransaction(transaction, function (err, t) {
                if(err) console.log('error', err);
                var sender = t.sender
//compare                
                if (wallet.eth.getBalance(sender).toNumber() < 5000000000000000000000000000000)
                {
                    
//invoke bank 
                     userWallet.eth.contract(abi).at(grantContract, function (err, contract) {
                        if (err) {
                            console.log("Contract creation error", err);
                            
                        } else if (contract.address) {
                            console.log("Contract Fetch", contract.address);
                            contract.fund({
                                gas: 5000000000000000000000
                            }, function (err, transaction) {
                                console.log(err, transaction);
                                watch(transaction, function (err, res) {
                                    console.log(err, res);
                                    
                                });
                            });
                     }})
                     
                }
            })
            
        })
    return {
        bank: bankAddress,
        address: wallet.address,
        eth: wallet.eth
    }
}


 
 // then create bank and assign banker id, problems with when the service goes offline and the bank losses connection

//watch


