const express = require('express');
const router = express.Router();
const Ajv = require('ajv');
const validator = require('../src/validator');
const jwt = require('jsonwebtoken');
const base64 = require('base-64');
const request = require('request');

const STAGING_URL = 'https://pooledlabs.com/saga-api/make_game_request';
const PRODUCTION_URL = 'https://lensa.com/saga-api/make_game_request';
const CLIENTID = 1;
const APIKEY = 2;

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Saga Node Client', clientId: CLIENTID, apiKey: APIKEY });
});

router.get('/results', function(req, res, next) {
  res.render('results', { title: 'Saga Node Client' });
});

router.post('/infosubmit', function(req, res, next) {
  const ajv = Ajv();
  const fields = req.body;
  const valid = ajv.validate(validator.schema, fields);

  if (!valid) {
    res.render('validation', { message: ajv.errorsText() });
  } else {
    const token = jwt.sign({ id: fields.clientId }, fields.apiKey);
    const encoded = base64.encode(`${fields.clientId}:${token}`);
    const url = req.body.useProduction ? PRODUCTION_URL : STAGING_URL;

    request({
      url,
      method: 'post',
      headers: { 'Authorization': `Bearer ${encoded}` },
      json: {
        ipaddress: req.connection.remoteAddress,
        name: fields.applicantName,
        email: fields.applicantEmail,
        redirect_url: fields.redirectUrl
      }
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.redirect(response.redirect_url);
      } else {
        res.render('validation', { message: JSON.stringify(body) });
      }
    });

  }
});

module.exports = router;
