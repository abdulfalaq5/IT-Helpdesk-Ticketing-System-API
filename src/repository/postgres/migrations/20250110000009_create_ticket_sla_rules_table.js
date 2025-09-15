exports.up = function(knex) {
  return knex.schema.createTable('ticket_sla_rules', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('priority_id').notNullable();
    table.integer('duration_hours').notNullable(); // SLA duration in hours
    table.text('description').nullable();
    table.boolean('is_active').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // Foreign keys
    table.foreign('priority_id').references('id').inTable('ticket_priorities').onDelete('RESTRICT');

    // Indexes
    table.index(['priority_id']);
    table.index(['is_active']);
    table.index(['created_at']);
    table.unique(['priority_id']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('ticket_sla_rules');
};
