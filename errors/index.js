/* eslint-disable */

exports.handle404 = (err, req, res, next) => {
  if (err.status === 404 || err.code === '23503') res.status(404).send({ message: err.message });
  else next(err);
};

exports.handle400 = (err, req, res, next) => {
  const codes400 = ['42703', '23503', '22P02', '23502'];
  const constraint404s = ['articles_topic_foreign', 'comments_article_id_foreign']
  if ((codes400.includes(err.code) || err.status === 400) && !constraint404s.includes(err.constraint)) res.status(400).send({ message: err.toString() })
  else next(err);
};

exports.handle500 = (err, req, res, next) => {
  console.log(err, '<<500 error');
  res.status(500).send({ message: 'i dont need to write this message because my server will never break hahahaahahaha ;_;' });
};

exports.handle422 = (err, req, res, next) => {
  const codes422 = ['23505'];
  if (codes422.includes(err.code)) res.status(422).send({ message: err.toString() });
  else next(err);
};

exports.handle405 = (req, res, next) => {
  res.status(405).send({ message: 'invalid method for this endpoint' });
};
