const articlesRouter = require('express').Router();
const { getArticles, getArticleById, updateArticleVotes } = require('../controllers/articlesController');
const { handle405 } = require('../errors');

articlesRouter
  .route('/')
  .get(getArticles)
  .all(handle405);

articlesRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(updateArticleVotes)
  .all(handle405);

module.exports = articlesRouter;
