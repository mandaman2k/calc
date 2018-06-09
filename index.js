var express = require('express');
var app = express();
var pool = require('./db.js');

app.get('/', function (req, res) {
        res.send('Jaime es Joto');
});

app.get('/getPrice', function (req, res) {
    pool.query('SELECT name, coin, CAST(price AS CHAR) price FROM Coins', function (err, result, fields) {
        if (err)
            throw err;
        res.json(result);
    });
});

app.get('/getbalance', function (req, res) {
    pool.query('SELECT name, coin, balance FROM Coins', function (err, result, fields) {
        if (err)
            throw err;
        res.json(result);
    });
});

app.get('/getAll', function (req, res) {
    pool.query('SELECT name, coin, balance, price FROM Coins', function (err, result, fields) {
        if (err)
            throw err;
        res.json(result);
    });
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));