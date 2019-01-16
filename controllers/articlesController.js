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
  if (typeof inc_votes !== 'number') return next({ status: 400, message: 'invalid vote increment' });
  return connection('articles')
    .where(req.params)
    .increment('votes', inc_votes)
    .returning('*')
    .then(([article]) => {
      if (!article) return Promise.reject({ status: 404, message: 'no such article found' });
      return res.status(200).send({ article });
    })
    .catch(next);
};

exports.deleteArticleById = (req, res, next) => {
  connection('articles')
    .where(req.params)
    .del()
    .returning('*')
    .then((result) => {
      if (result.length === 0) return Promise.reject({ status: 404, message: 'no such article found' });
      return res.sendStatus(204);
    })
    .catch(next);
};

exports.getArticleComments = (req, res, next) => {
  const {
    limit = 10, sort_by = 'created_at', order = 'desc', p = 1,
  } = req.query;
  connection('comments')
    .select('*')
    .where(req.params)
    .orderBy(sort_by, order)
    .limit(limit)
    .offset((p - 1) * limit)
    .then((comments) => {
      if (comments.length === 0) return Promise.reject({ status: 404, message: 'no comments found' });
      return res.status(200).send({ comments });
    })
    .catch(next);
};

exports.addCommentToArticle = (req, res, next) => {
  connection('comments')
    .insert({ ...req.body, ...req.params })
    .returning('*')
    .then(([comment]) => res.status(201).send({ comment }))
    .catch(next);
};

exports.updateCommentVotes = (req, res, next) => {
  const { inc_votes } = req.body;
  if (typeof inc_votes !== 'number') return next({ status: 400, message: 'invalid vote increment' });
  return connection('comments')
    .where(req.params)
    .increment('votes', inc_votes)
    .returning('*')
    .then(([comment]) => {
      if (!comment) return Promise.reject({ status: 404, message: 'no such comment found on requested article' });
      return res.status(200).send({ comment });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  connection('comments')
    .where(req.params)
    .del()
    .returning('*')
    .then((result) => {
      if (result.length === 0) return Promise.reject({ status: 404, message: 'no such comment found' });
      return res.sendStatus(204);
    })
    .catch(next);
};
