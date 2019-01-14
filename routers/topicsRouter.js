const topicsRouter = require('express').Router();
const { getTopics, getArticlesByTopic } = require('../controllers/topicsController');

topicsRouter.route('/').get(getTopics);

topicsRouter.route('/:topic/articles').get(getArticlesByTopic);

module.exports = topicsRouter;
