var contracts = {
    //app: require('./contracts/App.sol'),
    party: require('./contracts/Party.sol'),
    grant: require('./contracts/Grant.sol'),
    delegate: require('./contracts/Delegate.sol'),
    passwordDelegate: require('./contracts/PasswordDelegate.sol'),
    //bank: require('./contracts/Bank.sol')
    registrar: require('./contracts/PartyRegistrar.sol'),
};

var all = ""
Object.keys(contracts).forEach(function(key) {
    all += contracts[key]
});

module.exports = all;