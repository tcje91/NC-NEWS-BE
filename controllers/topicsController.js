const connection = require('../db/connection');

exports.getTopics = (req, res, next) => {
  connection('topics')
    .select()
    .then(topics => res.status(200).send({ topics }))
    .catch(next);
};

exports.getArticlesByTopic = (req, res, next) => {
  const {
    limit, sort_by, order, p,
  } = req.query;
  connection('articles')
    .select({ author: 'username' }, 'title', 'article_id', 'votes', 'created_at', 'topic') // NEED TO ADD COMMENT COUNT!!
    .where(req.params)
    .limit(limit || 10)
    .offset((p - 1) * limit || 0)
    .orderBy(sort_by || 'created_at', order || 'desc')
    .then(articles => res.status(200).send({ articles }))
    .catch(next);
};
