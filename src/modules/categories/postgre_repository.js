const { insert, updated, fetchByParam, deletePermanently, checkSameValueinDb } = require('../../repository/postgres/core_postgres')
const categoriesColumn = require('./column')

class CategoriesRepository {
  constructor() {
    this.table = 'ticket_categories'
    this.column = categoriesColumn
  }

  async create(payload) {
    return await insert(this.table, payload, Object.values(this.column))
  }

  async update(id, payload) {
    return await updated(this.table, { id }, payload, Object.values(this.column))
  }

  async findById(id) {
    return await fetchByParam(this.table, { id }, Object.values(this.column))
  }

  async findByName(name) {
    return await fetchByParam(this.table, { name }, Object.values(this.column))
  }

  async findAllActive() {
    const { pgCore } = require('../../config/database')
    return await pgCore(this.table)
      .where({ is_active: true })
      .orderBy('name', 'asc')
      .select(Object.values(this.column))
  }

  async findAll(filters = {}) {
    const { pgCore } = require('../../config/database')
    let query = pgCore(this.table)
    
    if (filters.is_active !== undefined) {
      query = query.where({ is_active: filters.is_active })
    }
    
    if (filters.search) {
      query = query.where(function() {
        this.where('name', 'ilike', `%${filters.search}%`)
          .orWhere('description', 'ilike', `%${filters.search}%`)
      })
    }
    
    return await query
      .orderBy('name', 'asc')
      .select(Object.values(this.column))
  }

  async delete(id) {
    return await deletePermanently(this.table, { id }, Object.values(this.column))
  }

  async checkNameExists(name, excludeId = null) {
    const where = { name }
    if (excludeId) {
      where.id = { '!=': excludeId }
    }
    return await checkSameValueinDb(this.table, where, 'name', 'Nama kategori sudah ada')
  }
}

module.exports = new CategoriesRepository()
