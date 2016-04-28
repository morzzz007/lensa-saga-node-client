const express = require('express');
const router = express.Router();
const Ajv = require('ajv');
const validator = require('../src/validator');
const jwt = require('jsonwebtoken');
const base64 = require('base-64');
const request = require('request');

const STAGING_URL = 'https://pooledlabs.com/saga-api/make_game_request';
const PRODUCTION_URL = 'https://lensa.com/saga-api/make_game_request';
const CLIENTID = '571dd4f12ecd8d002494b7b4';
const APIKEY = 'zvScPOrGXpCD8Ny1nMgTr1DER4P+GplGEUSBbzvG1utY/wqH3fdNyg';

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

    console.log('My remote address', req.ip);

    request({
      url,
      method: 'post',
      headers: { 'Authorization': `Bearer ${encoded}` },
      json: {
        ipaddress: req.ip,
        name: fields.applicantName,
        email: fields.applicantEmail,
        redirect_url: fields.redirectUrl
      }
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.redirect(body.redirect_url);
      } else {
        res.render('validation', { message: JSON.stringify(body) });
      }
    });

  }
});

module.exports = router;
