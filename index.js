var express = require('express');
var app = express();
var pool = require('./db.js');

app.get('/getPrice', function (req, res) {
    pool.query('SELECT coin, price FROM Coins', function (err, result, fields) {
        if (err)
            throw err;
        res.json(result);
    });
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));