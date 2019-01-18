/* eslint-disable */

const app = require('./app');

const { PORT = 9090 } = process.env;

app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log(`Server listening on port ${PORT}...`);
});
