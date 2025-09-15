/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('categories').del();
  
  // Inserts seed entries
  await knex('categories').insert([
    {
      id: knex.raw('uuid_generate_v4()'),
      name: 'Hardware',
      description: 'Masalah terkait perangkat keras komputer',
      is_active: true
    },
    {
      id: knex.raw('uuid_generate_v4()'),
      name: 'Software',
      description: 'Masalah terkait aplikasi dan perangkat lunak',
      is_active: true
    },
    {
      id: knex.raw('uuid_generate_v4()'),
      name: 'Network',
      description: 'Masalah terkait jaringan dan koneksi internet',
      is_active: true
    },
    {
      id: knex.raw('uuid_generate_v4()'),
      name: 'Access',
      description: 'Permintaan akses sistem atau aplikasi',
      is_active: true
    },
    {
      id: knex.raw('uuid_generate_v4()'),
      name: 'Email',
      description: 'Masalah terkait email dan komunikasi',
      is_active: true
    },
    {
      id: knex.raw('uuid_generate_v4()'),
      name: 'Security',
      description: 'Masalah keamanan dan privasi',
      is_active: true
    },
    {
      id: knex.raw('uuid_generate_v4()'),
      name: 'Other',
      description: 'Masalah lainnya',
      is_active: true
    }
  ]);
};
