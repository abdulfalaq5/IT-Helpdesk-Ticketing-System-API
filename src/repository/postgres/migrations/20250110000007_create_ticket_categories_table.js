exports.up = function(knex) {
  return knex.schema.createTable('ticket_categories', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('name', 100).notNullable();
    table.text('description').nullable();
    table.boolean('is_active').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // Indexes
    table.index(['name']);
    table.index(['is_active']);
    table.index(['created_at']);
    table.unique(['name']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('ticket_categories');
};
