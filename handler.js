'use strict';

const request = require('axios');
const {toICal} = require('./helpers');

module.exports.scrape = (event, context, callback) => {

  request('http://qosfc.com/fixtures').then(({data}) => {
    const response = {
      statusCode: 200,
      headers: {"content-type": "text/calendar"},
      body: toICal(data).toString()
    };


    callback(null, response);
  });
};

