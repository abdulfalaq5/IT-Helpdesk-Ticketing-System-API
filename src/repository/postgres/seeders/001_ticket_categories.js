exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('ticket_categories').del()
  
  // Inserts seed entries
  return await knex('ticket_categories').insert([
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Hardware Issue',
      description: 'Problems with computer hardware, printers, scanners, etc.',
      is_active: true
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      name: 'Software Issue',
      description: 'Problems with software applications, operating system, etc.',
      is_active: true
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      name: 'Network Issue',
      description: 'Internet connectivity, network access, VPN problems',
      is_active: true
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440004',
      name: 'Email Issue',
      description: 'Email client problems, email delivery issues',
      is_active: true
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440005',
      name: 'Account Access',
      description: 'Password reset, account lockout, permission issues',
      is_active: true
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440006',
      name: 'General Inquiry',
      description: 'General questions and information requests',
      is_active: true
    }
  ])
}
