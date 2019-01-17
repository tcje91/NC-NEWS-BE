const apiRouter = require('express').Router();
const topicsRouter = require('./topicsRouter');
const articlesRouter = require('./articlesRouter');
const usersRouter = require('./usersRouter');
const { handle405 } = require('../errors');
const { getEndpoints } = require('../controllers/apiController');

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/users', usersRouter);

apiRouter
  .route('/')
  .get(getEndpoints)
  .all(handle405);

module.exports = apiRouter;
