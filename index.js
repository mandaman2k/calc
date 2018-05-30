var Request = require("request");
var rp = require('request-promise');
var mysql = require('mysql');

var urls = ["https://api.bitso.com/v3/ticker/?book=btc_mxn", "https://api.coinmarketcap.com/v1/ticker/bitcoin/", "https://api.coinmarketcap.com/v1/ticker/luxcoin/"];

var pool = mysql.createPool({
    connectionLimit: 10,
    host: '35.229.125.123',
    user: 'root',
    password: 'Presario1',
    database: 'calc'
});

rp({
    method: 'GET',
    uri: 'https://api.bitso.com/v3/ticker/?book=btc_mxn',
    gzip: false
}).then(function (body) {
    result = JSON.parse(body);
    updatePrice('MXN', result.payload.bid)
}).catch(function (err) {
    console.log(err);
})

rp({
    method: 'GET',
    uri: 'https://api.coinmarketcap.com/v1/ticker/bitcoin/',
    gzip: false
}).then(function (body) {
    result = JSON.parse(body);
    updatePrice('USD', result[0].price_usd);
}).catch(function (err) {
    console.log(err);
})

rp({
    method: 'GET',
    uri: 'https://api.coinmarketcap.com/v1/ticker/luxcoin/',
    gzip: false
}).then(function (body) {
    result = JSON.parse(body);
    updatePrice('LUX', result[0].price_btc);
}).catch(function (err) {
    console.log(err);
})

function updatePrice(coin, value) {
    pool.query("UPDATE Coins SET price = " + value + " WHERE coin='" + coin + "';", function (err, result, fields) {
        if (err)
            throw err;
    });
}