'use strict';





var request = require('request');

var rp = require('request-promise');



var __request = function (urls, HTTP_method, gzip_Boolean) {

    var results = {};

    var t = urls.length;

    var c = 0;

    while (t--) {

        rp({

            method: HTTP_method,

            uri: urls[t],

            gzip: gzip_Boolean

        }).then(function (body) {

            results[t] = {

                err: false,

                data: body

            };

            //console.log(results);

        }).catch(function (error) {

            results[t] = {

                err: {

                    status: true,

                    name: error.name,

                    message: error.message

                }

            };

           // console.log(results);

        });

    }

    return results;

};

exports.__request = __request;