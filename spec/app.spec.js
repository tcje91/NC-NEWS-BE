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
        expect(body.topics[1]).to.have.keys('slug', 'description');
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
    it('POST status:400 bad request if client uses malformed body', () => request
      .post('/api/topics')
      .send({ character: 'luigi' })
      .expect(400));
    it('POST status:422 unprocessable entity if client attempts to add pre-existing topic slug', () => request
      .post('/api/topics')
      .send({ slug: 'mitch', description: 'itsa meeee, mitch!' })
      .expect(422));
    it('INVALID REQUEST status:405 rejects invalid requests to endpoint', () => {
      const invalidMethods = ['patch', 'put', 'delete'];
      const invalidRequests = invalidMethods.map(method => request[method]('/api/topics').expect(405));
      return Promise.all(invalidRequests);
    });
  });
  describe('/topics/:topic_id/articles', () => {
    it('GET status:200 responds with an array of articles from given topic_id with default query parameters', () => request
      .get('/api/topics/mitch/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.every(article => article.topic === 'mitch')).to.equal(true);
        expect(body.articles[0]).to.have.keys('author', 'title', 'article_id', 'votes', 'created_at', 'topic', 'comment_count');
        expect(body.articles[0].title).to.equal('Living in the shadow of a great man');
        expect(body.articles[0].comment_count).to.equal('13');
      }));
    it('GET status:200 accepts a limit query with default 10', () => request
      .get('/api/topics/mitch/articles?limit=5')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.have.length(5);
      }));
    it('GET status:200 accepts a p(page) query with default 1', () => request
      .get('/api/topics/mitch/articles?limit=5&p=2')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].article_id).to.equal(7);
      }));
    it('GET status:200 accepts a sort_by query with default created_at', () => request
      .get('/api/topics/mitch/articles?sort_by=title')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].title).to.equal('Z');
        expect(body.articles[9].title).to.equal('Am I a cat?');
      }));
    it('GET status:200 accepts an order query with default desc', () => request
      .get('/api/topics/mitch/articles?order=asc')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].title).to.equal('Moustache');
      }));
    it('GET status:404 reponse when client requests articles from non-existent topic', () => request
      .get('/api/topics/spaghetti/articles')
      .expect(404)
      .then(({ body }) => {
        expect(body.message).to.equal('no articles found');
      }));
    it('POST status:201 adds an article given title, body and username and responds with the article', () => request
      .post('/api/topics/mitch/articles')
      .send({ title: 'Is mitch in another castle???', body: 'yes', username: 'rogersop' })
      .expect(201)
      .then(({ body }) => {
        expect(body.article.title).to.equal('Is mitch in another castle???');
        expect(body.article.body).to.equal('yes');
        expect(body.article.username).to.equal('rogersop');
        expect(body.article.article_id).to.equal(13);
      }));
    it('POST status:400 if client uses malformed body', () => request
      .post('/api/topics/mitch/articles')
      .send({ fruit: 'banana', isLuigi: 'false' })
      .expect(400));
    it('POST status:400 if client uses non-existent username', () => request
      .post('/api/topics/mitch/articles')
      .send({ title: 'Is mitch in another castle???', body: 'yes', username: 'bowser' })
      .expect(400));
    it('POST status:400 (?) if client attempts to post to non-existent topic', () => request
      .post('/api/topics/spaghetti/articles')
      .send({ title: 'Is mitch in another castle???', body: 'yes', username: 'rogersop' })
      .expect(400));
    it('INVALID REQUEST status:405 rejects invalid requests to endpoint', () => {
      const invalidMethods = ['patch', 'put', 'delete'];
      const invalidRequests = invalidMethods.map(method => request[method]('/api/topics/mitch/articles').expect(405));
      return Promise.all(invalidRequests);
    });
  });
  describe('/articles', () => {
    it('GET status:200 responds with an array of article objects', () => request
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.be.an('array');
        expect(body.articles[0]).to.have.keys('author', 'title', 'article_id', 'body', 'votes', 'comment_count', 'created_at', 'topic');
      }));
    it('GET status:200 accepts a limit query with default 10', () => request
      .get('/api/articles?limit=5')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.have.length(5);
      }));
    it('GET status:200 accepts a p(page) query with default 1', () => request
      .get('/api/articles?p=2')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].title).to.equal('Am I a cat?');
      }));
    it('GET status:200 accepts a sort_by query with default created_at', () => request
      .get('/api/articles?sort_by=title')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].title).to.equal('Z');
        expect(body.articles[9].title).to.equal('Does Mitch predate civilisation?');
      }));
    it('GET status:200 accepts an order query with default desc', () => request
      .get('/api/articles?order=asc')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].title).to.equal('Moustache');
        expect(body.articles[9].title).to.equal('Eight pug gifs that remind me of mitch');
      }));
    it('INVALID REQUEST status:405 rejects invalid requests to endpoint', () => {
      const invalidMethods = ['post', 'patch', 'put', 'delete'];
      const invalidRequests = invalidMethods.map(method => request[method]('/api/articles').expect(405));
      return Promise.all(invalidRequests);
    });
  });
  describe('/articles/:article_id', () => {
    it('GET status:200 reponds with an article object for article of given article_id', () => request
      .get('/api/articles/3')
      .expect(200)
      .then(({ body }) => {
        expect(body.article).to.have.keys('author', 'title', 'article_id', 'body', 'votes', 'comment_count', 'created_at', 'topic');
        expect(body.article.article_id).to.equal(3);
      }));
    it('GET status:404 when client requests non-existent article', () => request
      .get('/api/articles/999')
      .expect(404)
      .then(({ body }) => {
        expect(body.message).to.equal('no such article found');
      }));
    it('GET status:400 when client requests invalid article_id', () => request
      .get('/api/articles/spaghetti')
      .expect(400));
    it('PATCH status:200 increases vote count when sent body with positive inc_votes', () => request
      .patch('/api/articles/1')
      .send({ inc_votes: 5 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article.votes).to.equal(105);
      }));
    it('PATCH status:200 decreases vote count when sent body with negative inc_votes', () => request
      .patch('/api/articles/1')
      .send({ inc_votes: -5 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article.votes).to.equal(95);
      }));
    it.only('INVALID REQUEST status:405 rejects invalid requests to endpoint', () => {
      const invalidMethods = ['post', 'put'];
      const invalidRequests = invalidMethods.map(method => request[method]('/api/articles/1').expect(405));
      return Promise.all(invalidRequests);
    });
  });
});
