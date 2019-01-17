exports.up = function (knex, Promise) {
  return knex.schema.createTable('articles', (articleTable) => {
    articleTable
      .increments('article_id')
      .primary()
      .unique();
    articleTable.string('title').notNullable();
    articleTable.string('topic').references('topics.slug').notNullable();
    articleTable.string('username').references('users.username').notNullable();
    articleTable.text('body').notNullable();
    articleTable.timestamp('created_at').defaultTo(knex.fn.now());
    articleTable.integer('votes').defaultTo(0);
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('articles');
};
