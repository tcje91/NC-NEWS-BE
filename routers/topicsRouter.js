const topicsRouter = require('express').Router();
const { getTopics, getArticlesByTopic, addTopic } = require('../controllers/topicsController');

topicsRouter
  .route('/')
  .get(getTopics)
  .post(addTopic);

topicsRouter.route('/:topic/articles').get(getArticlesByTopic);

module.exports = topicsRouter;
