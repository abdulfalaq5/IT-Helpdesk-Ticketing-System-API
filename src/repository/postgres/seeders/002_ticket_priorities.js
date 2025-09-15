exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('ticket_priorities').del()
  
  // Inserts seed entries
  return await knex('ticket_priorities').insert([
    {
      id: '650e8400-e29b-41d4-a716-446655440001',
      name: 'Low',
      description: 'Low priority issues that can be resolved within normal business hours',
      level: 1,
      color: '#28a745',
      is_active: true
    },
    {
      id: '650e8400-e29b-41d4-a716-446655440002',
      name: 'Medium',
      description: 'Medium priority issues that need attention within 24 hours',
      level: 2,
      color: '#ffc107',
      is_active: true
    },
    {
      id: '650e8400-e29b-41d4-a716-446655440003',
      name: 'High',
      description: 'High priority issues that need immediate attention',
      level: 3,
      color: '#fd7e14',
      is_active: true
    },
    {
      id: '650e8400-e29b-41d4-a716-446655440004',
      name: 'Critical',
      description: 'Critical issues that affect business operations',
      level: 4,
      color: '#dc3545',
      is_active: true
    }
  ])
}
