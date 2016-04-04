module.exports = function watch(web3) {



    return function (transaction, callback) {
        var filter = web3.eth.filter("latest");
        filter.watch(function (error, log) {
            web3.eth.getTransaction(transaction, function (err, t) {
                console.log("watch", t);
                if (t.blockHash) {
                    filter.stopWatching();
                    callback();
                }
            });

        });
    };
};