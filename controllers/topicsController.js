const connection = require('../db/connection');

exports.getTopics = (req, res, next) => {
  connection('topics')
    .select()
    .then(topics => res.status(200).send({ topics }))
    .catch(next);
};

exports.addTopic = (req, res, next) => {
  connection('topics')
    .insert(req.body)
    .returning('*')
    .then(([topic]) => res.status(201).send({ topic }))
    .catch(next);
};

exports.getArticlesByTopic = (req, res, next) => {
  const {
    limit, sort_by, order, p,
  } = req.query;
  connection('articles')
    .select({ author: 'articles.username' }, 'title', 'articles.article_id', 'articles.votes', 'articles.created_at', 'topic')
    .where(req.params)
    .limit(limit || 10)
    .offset((p - 1) * limit || 0)
    .orderBy(sort_by || 'created_at', order || 'desc')
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('articles.article_id')
    .count('comments.comment_id as comment_count')
    .then((articles) => {
      if (!articles.length) return Promise.reject({ status: 404, message: 'no articles found' });
      // console.log(articles);
      return res.status(200).send({ articles });
    })
    .catch(next);
};

exports.addArticleByTopic = (req, res, next) => {
  connection('articles')
    .insert({ ...req.body, ...req.params })
    .returning('*')
    .then(([article]) => res.status(201).send({ article }))
    .catch(next);
};
