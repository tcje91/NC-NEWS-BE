const topicsRouter = require('express').Router();
const {
  getTopics, getArticlesByTopic, addTopic, addArticleByTopic,
} = require('../controllers/topicsController');

topicsRouter
  .route('/')
  .get(getTopics)
  .post(addTopic);

topicsRouter
  .route('/:topic/articles')
  .get(getArticlesByTopic)
  .post(addArticleByTopic);

module.exports = topicsRouter;
