module.exports = {
  gameSchema: {
    'properties': {
      'applicantName': {
        'type': 'string',
        'minLength': 1
      },
      'applicantEmail': {
        'type': 'string',
        'format': 'email'
      },
    }
  },
  resultSchema: {
    'properties': {
      'gameId': {
        'type': 'string',
        'minLength': 1
      },
    }
  }
};
