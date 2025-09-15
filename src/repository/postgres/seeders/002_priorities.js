/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('priorities').del();
  
  // Inserts seed entries
  await knex('priorities').insert([
    {
      id: knex.raw('uuid_generate_v4()'),
      name: 'Low',
      description: 'Prioritas rendah - dapat diselesaikan dalam beberapa hari',
      level: 1,
      color: '#28a745',
      is_active: true
    },
    {
      id: knex.raw('uuid_generate_v4()'),
      name: 'Medium',
      description: 'Prioritas sedang - harus diselesaikan dalam 1-2 hari',
      level: 2,
      color: '#ffc107',
      is_active: true
    },
    {
      id: knex.raw('uuid_generate_v4()'),
      name: 'High',
      description: 'Prioritas tinggi - harus diselesaikan dalam beberapa jam',
      level: 3,
      color: '#fd7e14',
      is_active: true
    },
    {
      id: knex.raw('uuid_generate_v4()'),
      name: 'Critical',
      description: 'Prioritas kritis - harus diselesaikan segera',
      level: 4,
      color: '#dc3545',
      is_active: true
    }
  ]);
};
