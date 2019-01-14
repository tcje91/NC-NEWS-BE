process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');
const connection = require('../db/connection');

const request = supertest(app);

describe('/api', () => {
  beforeEach(() => connection.migrate
    .rollback()
    .then(() => connection.migrate.latest())
    .then(() => connection.seed.run()));
  after(() => connection.destroy());
  describe('/topics', () => {
    it('GET status:200 responds with array of topic objects', () => request
      .get('/api/topics')
      .expect(200)
      .then((res) => {
        expect(res.body.topics[0]).to.have.keys('slug', 'description');
      }));
  });
});
