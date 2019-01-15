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
      .then(({ body }) => {
        expect(body.topics[0]).to.have.keys('slug', 'description');
        expect(body.topics).be.an('array');
      }));
    it('POST status:201 adds a topic and returns the added topic', () => request
      .post('/api/topics')
      .send({ slug: 'mario', description: 'itsa meeee' })
      .expect(201)
      .then(({ body }) => {
        expect(body.topic.slug).to.equal('mario');
        expect(body.topic.description).to.equal('itsa meeee');
      }));
    it('POST status:400 bad request if client used malformed body', () => request
      .post('/api/topics')
      .send({ character: 'luigi' })
      .expect(400));
  });
});
