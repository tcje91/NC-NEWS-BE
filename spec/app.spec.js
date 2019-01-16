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
    it('INVALID REQUEST status:405 rejects invalid method requests to endpoint', () => {
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
    it('INVALID REQUEST status:405 rejects invalid method requests to endpoint', () => {
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
    it('INVALID REQUEST status:405 rejects invalid method requests to endpoint', () => {
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
    it('PATCH status:400 if client uses malformed body', () => request
      .patch('/api/articles/1')
      .send({ inc_votes: 'luigi' })
      .expect(400));
    it('PATCH status:404 if client attempts to update votes of non-existent article', () => request
      .patch('/api/articles/999')
      .send({ inc_votes: 10 })
      .expect(404));
    it('DELETE status:204 deletes article of given id and responds with no-content', () => request
      .delete('/api/articles/1')
      .expect(204)
      .then(() => request
        .get('/api/articles/1')
        .expect(404)));
    it('DELETE status:404 if client requests delete on non-existent article', () => request
      .delete('/api/articles/999')
      .expect(404));
    it('INVALID REQUEST status:405 rejects invalid method requests to endpoint', () => {
      const invalidMethods = ['post', 'put'];
      const invalidRequests = invalidMethods.map(method => request[method]('/api/articles/1').expect(405));
      return Promise.all(invalidRequests);
    });
  });
  describe('/articles/:article_id/comments', () => {
    it('GET status:200 returns an array of comment objects belonging to given article', () => request
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).to.be.an('array');
        expect(body.comments[0]).to.have.keys('comment_id', 'body', 'username', 'article_id', 'votes', 'created_at');
        expect(body.comments.every(comment => comment.article_id === 1)).to.equal(true);
      }));
    it('GET status:200 accepts a limit query with default 10', () => request
      .get('/api/articles/1/comments?limit=5')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).to.have.length(5);
      }));
    it('GET status:200 accepts a p(page) query with default 1', () => request
      .get('/api/articles/1/comments?p=2')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments[0].body).to.equal('Massive intercranial brain haemorrhage');
      }));
    it('GET status:200 accepts a sort_by query with default created_at', () => request
      .get('/api/articles/1/comments?sort_by=body')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments[0].body).to.equal('This morning, I showered for nine minutes.');
        expect(body.comments[9].body).to.equal('git push origin master');
      }));
    it('GET status:200 accepts an order query with default desc', () => request
      .get('/api/articles/1/comments?order=asc')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments[0].body).to.equal('This morning, I showered for nine minutes.');
        expect(body.comments[9].body).to.equal('I hate streaming noses');
      }));
    it('GET status:400 when client requests comments using invalid article_id', () => request
      .get('/api/articles/spaghetti/comments')
      .expect(400));
    it('GET status:404 when client requests comments from article with no comments', () => request
      .get('/api/articles/2/comments')
      .expect(404)
      .then(({ body }) => {
        expect(body.message).to.equal('no comments found');
      }));
    it('GET status:404 when client requests comments from non-existent article', () => request
      .get('/api/articles/999/comments')
      .expect(404)
      .then(({ body }) => {
        expect(body.message).to.equal('no comments found');
      }));
    it('POST status:201 adds a comment to article given username and body', () => request
      .post('/api/articles/1/comments')
      .send({ username: 'rogersop', body: 'gr8 stuff m8 i r8 8/8 str8 appreci8' })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).to.have.keys('comment_id', 'body', 'username', 'article_id', 'votes', 'created_at');
        expect(body.comment.article_id).to.equal(1);
        expect(body.comment.comment_id).to.equal(19);
        expect(body.comment.body).to.equal('gr8 stuff m8 i r8 8/8 str8 appreci8');
        expect(body.comment.votes).to.equal(0);
        expect(body.comment.username).that.equal('rogersop');
        return request
          .get('/api/articles/1/comments')
          .expect(200)
          .then((res) => {
            expect(res.body.comments[0].body).to.equal('gr8 stuff m8 i r8 8/8 str8 appreci8');
          });
      }));
    it('POST status:400 if client uses malformed body', () => request
      .post('/api/articles/1/comments')
      .send({ fruit: 'banana', isLuigi: 'false' })
      .expect(400));
    it('POST status:400 if client uses non-existent username', () => request
      .post('/api/articles/1/comments')
      .send({ body: 'what the **** did u just ****ing say about me you little *****', username: 'bowser' })
      .expect(400));
    it('POST status:400 (?) if client attempts to post to non-existent article', () => request
      .post('/api/articles/999/comments')
      .send({ body: 'can we get to 50 likes?????', username: 'rogersop' })
      .expect(400));
    it('INVALID REQUEST status:405 rejects invalid method requests to endpoint', () => {
      const invalidMethods = ['put', 'patch', 'delete'];
      const invalidRequests = invalidMethods.map(method => request[method]('/api/articles/1/comments').expect(405));
      return Promise.all(invalidRequests);
    });
  });
  describe('/articles/:article_id/comments/:comment_id', () => {
    it('PATCH status:200 increases vote count when sent body with positive inc_votes', () => request
      .patch('/api/articles/1/comments/2')
      .send({ inc_votes: 5 })
      .expect(200)
      .then(({ body }) => {
        expect(body.comment).to.eql({
          body:
    'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
          article_id: 1,
          comment_id: 2,
          username: 'butter_bridge',
          votes: 19,
          created_at: '2016-11-22T12:36:03.000Z',
        });
      }));
    it('PATCH status:200 decreases vote count when sent body with negative inc_votes', () => request
      .patch('/api/articles/1/comments/2')
      .send({ inc_votes: -5 })
      .expect(200)
      .then(({ body }) => {
        expect(body.comment).to.eql({
          body:
    'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
          article_id: 1,
          comment_id: 2,
          username: 'butter_bridge',
          votes: 9,
          created_at: '2016-11-22T12:36:03.000Z',
        });
      }));
    it('PATCH status:400 if client uses malformed body', () => request
      .patch('/api/articles/1/comments/2')
      .send({ inc_votes: 'luigi' })
      .expect(400));
    it('PATCH status:404 if client attempts to update votes of comment on non-existent article', () => request
      .patch('/api/articles/999/comments/2')
      .send({ inc_votes: 10 })
      .expect(404));
    it('PATCH status:404 if client attempts to update votes of non-existent comment', () => request
      .patch('/api/articles/1/comments/999')
      .send({ inc_votes: 10 })
      .expect(404));
    it('DELETE status:204 deletes comment of given id and responds with no-content', () => request
      .delete('/api/articles/1/comments/2')
      .expect(204)
      .then(() => request
        .get('/api/articles/1/comments?sort_by=comment_id&order=asc')
        .expect(200)
        .then(({ body }) => {
          expect(body.comments[0].comment_id).to.equal(3);
        })));
    it('DELETE status:404 if client requests delete on non-existent comment', () => request
      .delete('/api/articles/1/comments/999')
      .expect(404));
    it('INVALID REQUEST status:405 rejects invalid method requests to endpoint', () => {
      const invalidMethods = ['get', 'post', 'put'];
      const invalidRequests = invalidMethods.map(method => request[method]('/api/articles/1/comments/2').expect(405));
      return Promise.all(invalidRequests);
    });
  });
  describe('/users', () => {
    it('GET status:200 responds with an array of user objects', () => request
      .get('/api/users')
      .expect(200)
      .then(({ body }) => {
        expect(body.users).to.have.length(3);
        expect(body.users[0]).to.eql({
          username: 'butter_bridge',
          name: 'jonny',
          avatar_url: 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
        });
      }));
    it('INVALID REQUEST status:405 rejects invalid method requests to endpoint', () => {
      const invalidMethods = ['post', 'patch', 'put', 'delete'];
      const invalidRequests = invalidMethods.map(method => request[method]('/api/users').expect(405));
      return Promise.all(invalidRequests);
    });
  });
  describe('/users/:username', () => {
    it('GET status:200 responds with a user object of given username', () => request
      .get('/api/users/rogersop')
      .expect(200)
      .then(({ body }) => {
        expect(body.user).to.eql({
          username: 'rogersop',
          name: 'paul',
          avatar_url: 'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4',
        });
      }));
    it('GET status:404 when client requests user of non-existent username', () => request
      .get('/api/users/luigi')
      .expect(404));
    it('INVALID REQUEST status:405 rejects invalid method requests to endpoint', () => {
      const invalidMethods = ['post', 'put', 'patch', 'delete'];
      const invalidRequests = invalidMethods.map(method => request[method]('/api/users/rogersop').expect(405));
      return Promise.all(invalidRequests);
    });
  });
});
