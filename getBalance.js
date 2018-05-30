var Request = require("request");
var rp = require('request-promise');
var pool = require('./db');

setInterval(() => {
    pool.query("SELECT coin, balanceurl from Coins", function (err, result, fields) {
        if (err)
            throw err;
        result.forEach(element => {
            if (element.balanceurl != null) {
                rp({
                    method: 'GET',
                    uri: element.balanceurl,
                    gzip: false
                }).then(function (body) {
                    balance = JSON.parse(body);
                    console.log(element.coin);
                    if (element.coin == 'RVN') {
                        updateBalance(element.coin, balance.getuserbalance.data.confirmed);
                    } else {
                        updateBalance(element.coin, balance.balance);
                    }
                }).catch(function (err) {
                    console.log(err);
                });
            }
        });
    });
}, 7200000);

function updateBalance(coin, value) {
    pool.query("UPDATE Coins SET balance = " + value + " WHERE coin='" + coin + "';", function (err, result, fields) {
        if (err)
            throw err;
    });
}
