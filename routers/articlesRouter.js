const articlesRouter = require('express').Router();
const {
  getArticles, getArticleById, updateArticleVotes, deleteArticleById,
  getArticleComments, addCommentToArticle, updateCommentVotes, deleteCommentById,
} = require('../controllers/articlesController');
const { handle405 } = require('../errors');

articlesRouter
  .route('/')
  .get(getArticles)
  .all(handle405);

articlesRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(updateArticleVotes)
  .delete(deleteArticleById)
  .all(handle405);

articlesRouter
  .route('/:article_id/comments')
  .get(getArticleComments)
  .post(addCommentToArticle)
  .all(handle405);

articlesRouter
  .route('/:article_id/comments/:comment_id')
  .patch(updateCommentVotes)
  .delete(deleteCommentById)
  .all(handle405);

module.exports = articlesRouter;
