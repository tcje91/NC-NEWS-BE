const connection = require('../db/connection');

exports.getUsers = (req, res, next) => {
  connection('users')
    .select('*')
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getUserByUsername = (req, res, next) => {
  connection('users')
    .select('*')
    .where(req.params)
    .then(([user]) => {
      if (!user) return Promise.reject({ status: 404, message: 'no such user found' });
      return res.status(200).send({ user });
    })
    .catch(next);
};
