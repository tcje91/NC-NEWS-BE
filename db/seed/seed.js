const {
  userData, topicData, articleData, commentData,
} = require('../data/index');

const { formatArticles, formatComments } = require('../utils');

exports.seed = function (knex, Promise) {
  return knex
    .batchInsert('users', userData)
    .then(() => knex.batchInsert('topics', topicData))
    .then(() => {
      const formattedArticleData = formatArticles(articleData);
      return knex.batchInsert('articles', formattedArticleData).returning('*');
    })
    .then((articles) => {
      const articleLookup = articles.reduce((result, article) => {
        result[article.title] = article.article_id;
        return result;
      }, {});
      const formattedCommentData = formatComments(commentData, articleLookup);
      return knex.batchInsert('comments', formattedCommentData);
    })
    .catch(console.log);
};
