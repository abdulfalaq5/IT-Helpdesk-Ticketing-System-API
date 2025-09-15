/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('ticket_comments', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('ticket_id').notNullable();
    table.uuid('user_id').notNullable(); // Siapa yang komentar (FK ke users.user_id)
    table.text('comment').notNullable();
    table.boolean('is_internal').defaultTo(false); // Komentar internal untuk IT staff
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    // Foreign keys
    table.foreign('ticket_id').references('id').inTable('tickets').onDelete('CASCADE');
    
    // Indexes
    table.index(['ticket_id']);
    table.index(['user_id']);
    table.index(['created_at']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('ticket_comments');
};
