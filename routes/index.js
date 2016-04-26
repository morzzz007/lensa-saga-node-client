const express = require('express');
const router = express.Router();
const Ajv = require('ajv');
const validator = require('../src/validator');
const jwt = require('jsonwebtoken');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Saga Node Client' });
});

router.get('/results', function(req, res, next) {
  res.render('results', { title: 'Saga Node Client' });
});

router.post('/infosubmit', function(req, res, next) {
  const ajv = Ajv();
  const fields = req.body;
  const token = jwt.sign({ foo: 'bar' }, 'shhhhh');

  // input validation
  const valid = ajv.validate(validator.schema, fields);

  if (!valid) {
    res.render('validation', { message: ajv.errorsText() });
  } else {
    res.redirect('http://lensa.com');
  }

});

module.exports = router;
