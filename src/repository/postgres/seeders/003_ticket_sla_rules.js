exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('ticket_sla_rules').del()
  
  // Inserts seed entries
  return await knex('ticket_sla_rules').insert([
    {
      id: '750e8400-e29b-41d4-a716-446655440001',
      priority_id: '650e8400-e29b-41d4-a716-446655440001', // Low
      duration_hours: 72, // 3 days
      description: 'Low priority tickets should be resolved within 3 business days',
      is_active: true
    },
    {
      id: '750e8400-e29b-41d4-a716-446655440002',
      priority_id: '650e8400-e29b-41d4-a716-446655440002', // Medium
      duration_hours: 24, // 1 day
      description: 'Medium priority tickets should be resolved within 1 business day',
      is_active: true
    },
    {
      id: '750e8400-e29b-41d4-a716-446655440003',
      priority_id: '650e8400-e29b-41d4-a716-446655440003', // High
      duration_hours: 8, // 8 hours
      description: 'High priority tickets should be resolved within 8 hours',
      is_active: true
    },
    {
      id: '750e8400-e29b-41d4-a716-446655440004',
      priority_id: '650e8400-e29b-41d4-a716-446655440004', // Critical
      duration_hours: 4, // 4 hours
      description: 'Critical priority tickets should be resolved within 4 hours',
      is_active: true
    }
  ])
}
