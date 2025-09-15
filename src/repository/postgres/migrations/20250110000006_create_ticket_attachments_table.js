/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('ticket_attachments', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('ticket_id').notNullable();
    table.uuid('uploaded_by').notNullable(); // Siapa yang upload (FK ke users.user_id)
    table.string('file_name', 255).notNullable();
    table.string('file_path', 500).notNullable();
    table.string('file_type', 100).nullable();
    table.integer('file_size').nullable(); // dalam bytes
    table.text('description').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    // Foreign keys
    table.foreign('ticket_id').references('id').inTable('tickets').onDelete('CASCADE');
    
    // Indexes
    table.index(['ticket_id']);
    table.index(['uploaded_by']);
    table.index(['created_at']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('ticket_attachments');
};
