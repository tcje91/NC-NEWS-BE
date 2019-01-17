const path = require('path');

exports.getEndpoints = (req, res, next) => {
  res
    .status(200)
    .sendFile(path.join(__dirname, '../', 'endpoints.json'), null, (err) => {
      if (err) next(err);
    });
};
