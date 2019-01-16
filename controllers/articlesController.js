const connection = require('../db/connection');

exports.getArticles = (req, res, next) => {
  const {
    limit = 10, sort_by = 'created_at', order = 'desc', p = 1,
  } = req.query;
  connection('articles')
    .select('title', { author: 'articles.username' }, 'articles.article_id', 'articles.body', 'articles.votes', 'articles.created_at', 'topic')
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('articles.article_id')
    .count('comments.comment_id as comment_count')
    .orderBy(sort_by, order)
    .limit(limit)
    .offset((p - 1) * limit)
    .then(articles => res.status(200).send({ articles }))
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  connection('articles')
    .select('title', { author: 'articles.username' }, 'articles.article_id', 'articles.body', 'articles.votes', 'articles.created_at', 'topic')
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('articles.article_id')
    .count('comments.comment_id as comment_count')
    .where({ 'articles.article_id': req.params.article_id })
    .then(([article]) => {
      if (!article) return Promise.reject({ status: 404, message: 'no such article found' });
      return res.status(200).send({ article });
    })
    .catch(next);
};

exports.updateArticleVotes = (req, res, next) => {
  const { inc_votes } = req.body;
  connection('articles')
    .where(req.params)
    .increment('votes', inc_votes)
    .returning('*')
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
