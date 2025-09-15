const { insert, updated, fetchByParam, deletePermanently, checkSameValueinDb } = require('../../repository/postgres/core_postgres')
const slaRulesColumn = require('./column')

class SlaRulesRepository {
  constructor() {
    this.table = 'ticket_sla_rules'
    this.column = slaRulesColumn
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

  async findByPriorityId(priorityId) {
    return await fetchByParam(this.table, { priority_id: priorityId }, Object.values(this.column))
  }

  async findAllActive() {
    const { pgCore } = require('../../config/database')
    return await pgCore(this.table)
      .where({ is_active: true })
      .orderBy('duration_hours', 'asc')
      .select(Object.values(this.column))
  }

  async findAll(filters = {}) {
    const { pgCore } = require('../../config/database')
    let query = pgCore(this.table)
    
    if (filters.is_active !== undefined) {
      query = query.where({ is_active: filters.is_active })
    }
    
    if (filters.priority_id) {
      query = query.where({ priority_id: filters.priority_id })
    }
    
    return await query
      .orderBy('duration_hours', 'asc')
      .select(Object.values(this.column))
  }

  async findAllWithPriority() {
    const { pgCore } = require('../../config/database')
    return await pgCore(this.table)
      .join('priorities', 'sla_rules.priority_id', 'priorities.id')
      .select(
        'sla_rules.*',
        'priorities.name as priority_name',
        'priorities.level as priority_level',
        'priorities.color as priority_color'
      )
      .orderBy('priorities.level', 'asc')
  }

  async delete(id) {
    return await deletePermanently(this.table, { id }, Object.values(this.column))
  }

  async checkPriorityExists(priorityId, excludeId = null) {
    const where = { priority_id: priorityId }
    if (excludeId) {
      where.id = { '!=': excludeId }
    }
    return await checkSameValueinDb(this.table, where, 'priority_id', 'SLA rule untuk prioritas ini sudah ada')
  }
}

module.exports = new SlaRulesRepository()
