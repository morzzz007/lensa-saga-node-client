module.exports = {
  schema: {
    'properties': {
      'applicantName': {
        'type': 'string',
        'minLength': 1
      },
      'applicantEmail': {
        'type': 'string',
        'format': 'email'
      },
      'redirectUrl': {
        'type': 'string',
        'minLength': 1
      },
      'clientId': {
        'type': 'string',
        'minLength': 1
      },
      'apiKey': {
        'type': 'string',
        'minLength': 1
      },
    }
  }
};
