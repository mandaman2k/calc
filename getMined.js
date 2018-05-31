var Request = require("request");
var rp = require('request-promise');
var pool = require('./db');

setInterval(() => {
    pool.query("SELECT id, coin, mineurl from Coins", function (err, result, fields) {
        if (err)
            throw err;
        result.forEach(element => {
            if (element.mineurl != null) {
                rp({
                    method: 'GET',
                    uri: element.mineurl,
                    gzip: false
                }).then(function (body) {
                    balance = JSON.parse(body);
                    if (body == '{"error":"limit"}') {
                        console.log("error: " + element.id);
                    } else {
                        if (element.coin == "DGB") {
                            pooli(element, balance.getdashboarddata.data.recent_credits_24hours.amount);
                        } else {
                            pooli(element, balance.paid24h);
                        }
                    }
                }).catch(function (err) {
                    console.log(err);
                });
            } else {
                pooli(element, 0);
            }
        });
    });
}, 7200000);

function pooli(element, paid) {
    console.log('Pool2:' + element.coin + ': ' + paid);
    pool.query("SELECT id, date FROM Mined WHERE idcoin = " + element.id + " ORDER BY 1 DESC", function (err, result, fields) {
        if (result.length > 1) {
            var dbDate = new Date(result[0].date);
            var now = new Date(Date.now());
            if (now.getDate() != dbDate.getDate()) {
                insertMined(element.id, paid);
            }
            else {
                UpdateMined(result[0].id, paid);
            }
        }
    });
}

function UpdateMined(id, value) {
    pool.query("UPDATE Mined SET paid = " + value + " WHERE id = " + id + ";", function (err, result, fields) {
        if (err)
            throw err;
    });
}

function insertMined(coinid, value) {
    pool.query("INSERT INTO Mined (idcoin, paid) values (?, ?)", [coinid, value], function (err, result, fields) {
        if (err)
            throw err;
    });
}