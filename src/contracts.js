var fs = require('fs');

require.extensions['.sol'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};


var contracts = {
    app: require('./contracts/App.sol'),
    user: require('./contracts/User.sol'),
    grant: require('./contracts/Grant.sol'),
    passwordDelegate: require('./contracts/PasswordDelegate.sol')
};

var all = ""
Object.keys(contracts).forEach(function(key) {
    all += contracts[key]
});

module.exports = all;