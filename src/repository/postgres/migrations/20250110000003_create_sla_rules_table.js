/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('sla_rules', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('priority_id').notNullable();
    table.integer('duration_hours').notNullable(); // SLA dalam jam
    table.text('description').nullable();
    table.boolean('is_active').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    table.foreign('priority_id').references('id').inTable('priorities').onDelete('CASCADE');
    table.index(['priority_id']);
    table.index(['is_active']);
    table.unique(['priority_id']); // Satu prioritas hanya punya satu SLA rule
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('sla_rules');
};
