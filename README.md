# NC News

[NC News](https://nc-news-tcje.herokuapp.com/api/) is a Node.js API which functions as the back-end of a web forum, serving data from a PSQL database.

## Endpoints

The NC News API can be found hosted at the following URL: ```https://nc-news-tcje.herokuapp.com/api/```  
It serves the following endpoints and methods:

```/api```
- GET: serves a JSON detailing all available endpoints and methods

```/api/topics```
- GET: responds with an array of topic objects
- POST: accepts body of ```{ slug, description }```, adds topic and responds with added topic object

```/topics/:topic_id/articles```
- GET: responds with an array of article objects of specified topic_id. Accepts queries for: ```limit```, ```p``` (page), ```sort_by``` and ```order```
- POST: accepts body of ```{ title, body, username }```, adds article with specified ```topic_id``` and responds with created article object

```/api/articles```
- GET: responds with an array of article objects. Accepts queries for: ```limit```, ```p``` (page), ```sort_by```, ```order```

```/api/articles/:article_id```
- GET: responds with article object of article with specified ```article_id```
- PATCH: accepts body of ```{ inc_votes }``` where ```inc_votes``` is an integer, increments article vote count accordingly and responds with updated article object
  - DELETE: deletes article object of specified ```article_id``` and responds with no content

```/api/articles/:article_id/comments```
- GET: responds with an array of comment objects belonging to specified article. accepts queries for: ```limit```, ```p``` (page), ```sort_by``` and ```order```
- POST: accepts body of ```{ username, body }```, adds comment to specified article and responds with comment object

```/api/articles/:article_id/comments/:comment_id```
- PATCH: accepts body of ```{ inc_votes }``` where ```inc_votes``` is an integer, increments specified comment vote count accordingly and responds with updated comment object
- DELETE: deletes comment object of specified ```comment_id``` and responds with no content

```/api/users```
- GET: responds with an array of user objects

```/api/users/:username```
- GET: responds with user object of specified ```username```

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

The following must be installed on your computer before you can begin developing with this projecet:

* Node.js
* Node Package Manager (npm)
* git (and a github account)
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

You can then create and seed the development database with the command:

```
npm run seed:db
```

The test database will automatically be re-created, migrated and seeded upon running the test command (see below).

If you wish to manually rollback or update the database migrations, the following commands can be used:

```
npm run migrate:rollback
npm run migrate:latest
```

To start the server listening for development purposes, use:

```
npm run dev
```
By default the server listens on port **9090**. This can be changed in listen.js.  

You can then begin making requests to the server using, for example, Postman on the url: ```https://localhost:9090/api```

To cease listening, input **Ctrl+C** into the terminal.

## Running the tests

To run the provided tests, enter the command:

```
npm test
```

If you wish to inspect or alter the tests, they can be found in app.spec.js in the spec directory.

The tests check that all available endpoints respond appropriately to each valid request, and produce the appropriate errors for invalid requests.

## Deployment

Add additional notes about how to deploy this on a live system

## Acknowledgments

* Mitch, for providing the inspiration for the test data
* Ant, for dealing with my many questions
* Jonny - he helped me one time too