/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('sla_rules').del();
  
  // Get priority IDs first
  const priorities = await knex('priorities').select('id', 'name');
  const priorityMap = {};
  priorities.forEach(p => {
    priorityMap[p.name] = p.id;
  });
  
  // Inserts seed entries
  await knex('sla_rules').insert([
    {
      id: knex.raw('uuid_generate_v4()'),
      priority_id: priorityMap['Low'],
      duration_hours: 72, // 3 hari
      description: 'SLA untuk prioritas rendah',
      is_active: true
    },
    {
      id: knex.raw('uuid_generate_v4()'),
      priority_id: priorityMap['Medium'],
      duration_hours: 48, // 2 hari
      description: 'SLA untuk prioritas sedang',
      is_active: true
    },
    {
      id: knex.raw('uuid_generate_v4()'),
      priority_id: priorityMap['High'],
      duration_hours: 24, // 1 hari
      description: 'SLA untuk prioritas tinggi',
      is_active: true
    },
    {
      id: knex.raw('uuid_generate_v4()'),
      priority_id: priorityMap['Critical'],
      duration_hours: 8, // 8 jam
      description: 'SLA untuk prioritas kritis',
      is_active: true
    }
  ]);
};
