/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('tickets', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('ticket_number', 20).notNullable(); // Format: TKT-YYYYMMDD-001
    table.uuid('user_id').notNullable(); // Requester (FK ke users.user_id dari SSO)
    table.uuid('assigned_to').nullable(); // IT Staff yang ditugaskan (FK ke users.user_id)
    table.uuid('category_id').notNullable();
    table.uuid('priority_id').notNullable();
    table.string('title', 255).notNullable();
    table.text('description').notNullable();
    table.enum('status', ['open', 'in_progress', 'on_hold', 'resolved', 'closed']).defaultTo('open');
    table.timestamp('sla_deadline').nullable(); // Dihitung otomatis dari SLA rule
    table.timestamp('resolved_at').nullable();
    table.timestamp('closed_at').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Foreign keys
    table.foreign('category_id').references('id').inTable('ticket_categories').onDelete('RESTRICT');
    table.foreign('priority_id').references('id').inTable('ticket_priorities').onDelete('RESTRICT');
    
    // Indexes
    table.index(['user_id']);
    table.index(['assigned_to']);
    table.index(['category_id']);
    table.index(['priority_id']);
    table.index(['status']);
    table.index(['sla_deadline']);
    table.index(['created_at']);
    table.unique(['ticket_number']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('tickets');
};
