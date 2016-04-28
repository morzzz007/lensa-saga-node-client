const express = require('express');
const router = express.Router();
const Ajv = require('ajv');
const ajv = Ajv();
const validator = require('../src/validator');
const jwt = require('jsonwebtoken');
const base64 = require('base-64');
const request = require('request');

const SAMPLE_CLIENTID = '571dd4f12ecd8d002494b7b4';
const SAMPLE_APIKEY = 'zvScPOrGXpCD8Ny1nMgTr1DER4P+GplGEUSBbzvG1utY/wqH3fdNyg';

const GAME_REQUEST_URL = 'https://pooledlabs.com/saga-api/make_game_request';
const GET_RESULTS_URL = 'https://pooledlabs.com/saga-api/get_game_stats';

router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Saga Node Client',
    clientId: SAMPLE_CLIENTID,
    apiKey: SAMPLE_APIKEY,
    returnUrl: `https://${req.headers.host}/results/`,
  });
});

router.post('/infosubmit', function(req, res, next) {
  const fields = req.body;
  const valid = ajv.validate(validator.gameSchema, fields);

  if (!valid) {
    res.render('validation', { message: ajv.errorsText() });
  } else {
    const token = jwt.sign({ id: SAMPLE_CLIENTID }, SAMPLE_APIKEY);
    const encoded = base64.encode(`${SAMPLE_CLIENTID}:${token}`);

    request({
      url : GAME_REQUEST_URL,
      method: 'post',
      headers: { 'Authorization': `Bearer ${encoded}` },
      json: {
        ipaddress: req.ip,
        name: fields.applicantName,
        email: fields.applicantEmail,
        redirect_url: `https://${req.headers.host}/results/`,
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

router.post('/resultsubmit', function(req, res, next) {
  const fields = req.body;
  const valid = ajv.validate(validator.resultSchema, fields);

  if (!valid) {
    res.render('validation', { message: ajv.errorsText() });
  } else {
    const token = jwt.sign({ id: SAMPLE_CLIENTID }, SAMPLE_APIKEY);
    const encoded = base64.encode(`${SAMPLE_CLIENTID}:${token}`);

    request({
      url: `${GET_RESULTS_URL}/${fields.gameId}`,
      method: 'get',
      headers: { 'Authorization': `Bearer ${encoded}` },
    }, function (error, response, body) {
      console.log('body', error, response, body);
      if (!error && response.statusCode == 200) {
        res.render('results', { response: JSON.stringify(body) });
      } else {
        res.render('validation', { message: JSON.stringify(body) });
      }
    });

  }
});

module.exports = router;
