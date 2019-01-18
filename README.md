# NC News

## Description

[NC News](https://nc-news-tcje.herokuapp.com/api/) is a Node.js API which functions as the back-end of a web forum, serving data from a PSQL database. Data includes information regarding users, topics, articles and comments.

## Endpoints

The NC News API can be found hosted at the following URL: ```https://nc-news-tcje.herokuapp.com```  
It serves the following endpoints and methods:

```/api```
- GET: serves a JSON detailing all available endpoints and methods

```/api/topics```
- GET: responds with an array of topic objects
- POST: accepts body of ```{ slug, description }```, adds topic and responds with added topic object.  
Both ```slug``` and ```description``` are strings.

```/topics/:topic_id/articles```
- GET: responds with an array of article objects of specified topic_id. Accepts queries for: ```limit```, ```p``` (page), ```sort_by``` and ```order```.  
```limit``` and ```p``` are integers. ```order``` can be ```asc``` (ascending) or ```desc``` (descending). ```sort_by``` can be one of: ```created_at```, ```title```, ```author```, ```article_id```, ```votes```.
- POST: accepts body of ```{ title, body, username }```, adds article with specified ```topic_id``` and responds with created article object.  
```title``` and ```body``` are strings. ```username``` must reference a pre-existing user.

```/api/articles```
- GET: responds with an array of article objects. Accepts queries for: ```limit```, ```p``` (page), ```sort_by```, ```order```.  
```limit``` and ```p``` are integers. ```order``` can be ```asc``` (ascending) or ```desc``` (descending). ```sort_by``` can be one of: ```created_at```, ```title```, ```author```, ```article_id```, ```votes```, ```topic```.

```/api/articles/:article_id```
- GET: responds with article object of article with specified ```article_id```
- PATCH: accepts body of ```{ inc_votes }``` where ```inc_votes``` is an integer, increments specified article vote count accordingly and responds with updated article object.
- DELETE: deletes article object of specified ```article_id``` and responds with no content.

```/api/articles/:article_id/comments```
- GET: responds with an array of comment objects belonging to specified article. accepts queries for: ```limit```, ```p``` (page), ```sort_by``` and ```order```.  
```limit``` and ```p``` are integers. ```order``` can be ```asc``` (ascending) or ```desc``` (descending). ```sort_by``` can be one of: ```created_at```, ```title```, ```author```, ```votes```, ```topic```, ```body```, ```article_id```, ```comment_id```.
- POST: accepts body of ```{ username, body }```, adds comment to specified article and responds with comment object.  
```body``` is a string. ```username``` must reference a pre-existing user.

```/api/articles/:article_id/comments/:comment_id```
- PATCH: accepts body of ```{ inc_votes }``` where ```inc_votes``` is an integer, increments specified comment vote count accordingly and responds with updated comment object.
- DELETE: deletes comment object of specified ```comment_id``` and responds with no content.

```/api/users```
- GET: responds with an array of user objects.

```/api/users/:username```
- GET: responds with user object of specified ```username```.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

The following must be installed on your computer before you can begin developing with this projecet:

* Node.js
* Node Package Manager (npm)
* git (you will also need a github account)
* PostgreSQL

### Installing

Once you have installed the prerequisites, fork this repository using the button at the top right of this page. Then, from your personal fork, click the **Clone or download** button, also near the top right, and copy the link to your repository.

With that done, navigate in your terminal to where you would like to install the project, then run the following command to clone a copy to your local machine:

```
git clone repoURL
```
where repoURL is the URL to your forked repository.  

Now you must install the project dependencies using:
```
npm install
```
Next, you will need to create a file that stores the config information needed to access your databases. In your project folder, create a file named ```knexfile.js``` and fill it with the following:

```
const { DB_URL } = process.env;

module.exports = {
  development: {
    client: 'pg',
    connection: {
      username: 'username',
      password: 'password',
      database: 'nc_news',
    },
    seeds: {
      directory: './db/seed',
    },
    migrations: {
      directory: './db/migrations',
    },
  },
  test: {
    client: 'pg',
    connection: {
      username: 'username',
      password: 'password',
      database: 'nc_news_test',
    },
    seeds: {
      directory: './db/seed',
    },
    migrations: {
      directory: './db/migrations',
    },
  },
  production: {
    client: 'pg',
    connection: `${DB_URL}?ssl=true`,
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seed',
    },
  },
};
```
Make sure to change the ```username``` and ```password``` keys in both ```test``` and ```development``` to be your PSQL username and password.  

You can then create and seed the development database with the command:

```
npm run seed:db
```

The test database will automatically be created (or recreated, if it already exists), migrated and seeded upon running the test script (see below).

If you wish to manually rollback or update the database migrations, the following commands can be used:

```
npm run migrate:rollback
npm run migrate:latest
```

To start the server listening for development purposes, use:

```
npm run dev
```
By default the server listens on port **9090**. This can be changed in ```listen.js```.  

You can then begin making requests to the server using, for example, Postman on the url: ```https://localhost:9090```

To cease listening, input **Ctrl+C** into the terminal.

## Running the tests

To run the provided tests, enter the command:

```
npm test
```

If you wish to inspect or alter the tests, they can be found in ```app.spec.js``` in the ```spec``` directory.

The tests check that all available endpoints respond appropriately to each valid request, and produce the appropriate errors for invalid requests.

Here is an example of one of the tests:

```
describe('/topics', () => {
    it('GET status:200 responds with array of topic objects', () => request
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).be.an('array');
        expect(body.topics[0]).to.have.keys('slug', 'description');
      }));
});
```
The `describe` block contains all the tests for a given route. Generally, each `it` block tests a particlular method (e.g. `GET`) on a particular route (e.g. `/api/topics`). This can be achieved by chaining methods onto the end of a `request`. A set of conditions, laid out in the `expect` statements, must be met in order to pass the test. An "unexpected" result will cause the test to fail, and details of the failure will be displayed in the console. In this case, the request must return a status code `200`, and the response's `body` must be an object with key `topics`, which in turn has a value of an `array` whose elements are objects with keys `slug` and `description`.

You can use this template to design your own tests.

## Deployment

If you would like to deploy your own version of the API, you can use a service like [Heroku](https://www.heroku.com/).  
To deploy your app on Heroku, you must first create an account, and install the Heroku Command Line Interface (CLI).

To install the CLI, run the following command:
```
npm install -g heroku
```

After creating an account and installing the CLI, follow these steps to deploy your app:

1. Ensure you are logged in by using `heroku login`
2. Create and name your heroku app using `heroku create <app-name>`
3. After commiting your latest changes using `git add` and `git commit`, you can publish your app using `git push heroku master`.
4. Go to the heroku site and login. Choose your application and provide an `add-on` of `Heroku Postgres` which will provide you with a pre-created PSQL database.
5. If you click on your newly created database, then go to `Settings > View Credentials` you should see a URI string. Take note of this.
6. On the command line, type `heroku config:get DATABASE_URL`. If you're in the app's directory, and it is correctly linked as an add-on to heroku, it should display the same DB URI string.
7. Push any remaining changes to heroku and then view your app using `heroku open`. You should now see your app hosted on heroku!
8. If you should have issues, `heroku logs --tail` will display logs containing any errors. Use these to debug.
## Authors

- **Tom Edwards** - [tcje91](https://github.com/tcje91)

## Acknowledgments

* Mitch, for providing the inspiration for the test data
* Ant, for dealing with my many questions
* Jonny - he helped me that one time too :)
* The rest of the folks at Northcoders