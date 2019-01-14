
exports.up = function (knex, Promise) {
  return knex.schema.createTable('comments', (commentTable) => {
    commentTable.increments('comment_id').primary().unique();
    commentTable.text('body').notNullable();
    commentTable.integer('article_id').notNullable().references('articles.article_id');
    commentTable.string('username').notNullable().references('users.username');
    commentTable.integer('votes').defaultTo(0);
    commentTable.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('comments');
};
