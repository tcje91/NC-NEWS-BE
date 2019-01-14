const {
  userData, topicData, articleData, commentData,
} = require('../data/index');

const { formatArticles } = require('../utils');

exports.seed = function (knex, Promise) {
  return knex
    .batchInsert('users', userData)
    .then(() => knex.batchInsert('topics', topicData))
    .then(() => {
      const formattedArticleData = formatArticles(articleData);
      return knex.batchInsert('articles', formattedArticleData);
    })
    .catch(console.log);
};
