module.exports = function watch(web3) {



    return function (transaction, callback) {
        var filter = web3.eth.filter("latest");
        filter.watch(function (err, log) {
            if(err) return callback(err);
            web3.eth.getTransactionReceipt(transaction, function (err, t) {
                if(err) return callback(err);
                if (t && t.blockHash) {
                    console.log("watch", t);
                    filter.stopWatching();
                    callback();
                }
            });

        });
    };
};