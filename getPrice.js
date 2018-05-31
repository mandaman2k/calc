var Request = require("request");
var rp = require('request-promise');
var pool = require('./db');

setInterval(() => {
    //MXN
    rp({
        method: 'GET',
        uri: 'https://api.bitso.com/v3/ticker/?book=btc_mxn',
        gzip: false
    }).then(function (body) {
        result = JSON.parse(body);
        updatePrice('MXN', result.payload.bid)
    }).catch(function (err) {
        console.log(err);
    });

    //USD
    rp({
        method: 'GET',
        uri: 'https://api.coinmarketcap.com/v1/ticker/bitcoin/',
        gzip: false
    }).then(function (body) {
        result = JSON.parse(body);
        updatePrice('USD', result[0].price_usd);
    }).catch(function (err) {
        console.log(err);
    });

    //LUX //DNR
    cryptopiaArray = ["LUX", "DNR"];
    cryptopiaArray.forEach(element => {
        rp({
            method: 'GET',
            uri: 'https://www.cryptopia.co.nz/api/GetMarket/' + element + '_BTC',
            gzip: false
        }).then(function (body) {
            body = JSON.parse(body);
            updatePrice(element, body.Data.BidPrice);
        }).catch(function (err) {
            console.log(err);
        });
    });

    //LIZ KEC FLM PGN RVN AXS
    cbArray = ["LIZ", "KEC", "FLM", "PGN", "RVN", "SPD", "AXS"];
    rp({
        method: 'GET',
        uri: 'https://api.crypto-bridge.org/api/v1/ticker',
        gzip: false
    }).then(function (body) {
        body = JSON.parse(body);
        cbArray.forEach(element => {
            result = findElement(body, "id", element + "_BTC").bid;
            updatePrice(element, result);
        });
    }).catch(function (err) {
        console.log(err);
    });

    seArray = ["SPK"];
    rp({
        method: 'GET',
        uri: 'https://stocks.exchange/api2/ticker',
        gzip: false
    }).then(function (body) {
        body = JSON.parse(body);
        seArray.forEach(element => {
            result = findElement(body, "market_name", element + "_BTC").bid;
            updatePrice(element, result);
        });
    }).catch(function (err) {
        console.log(err);
    });
}, 300000);

function updatePrice(coin, value) {
    pool.query("UPDATE Coins SET price = " + value + " WHERE coin='" + coin + "';", function (err, result, fields) {
        if (err)
            throw err;
    });
}

function findElement(arr, propName, propValue) {
    for (var i = 0; i < arr.length; i++)
        if (arr[i][propName] == propValue)
            return arr[i];

    // will return undefined if not found; you could return a default instead
}