const app = require('express')();
const bodyParser = require('body-parser');
const apiRouter = require('./routers/apiRouter');
const {
  handle404, handle400, handle500, handle422,
} = require('./errors');

app.use(bodyParser.json());

app.use('/api', apiRouter);

app.use(handle400);
app.use(handle422);
app.use(handle404);
app.use(handle500);

module.exports = app;
