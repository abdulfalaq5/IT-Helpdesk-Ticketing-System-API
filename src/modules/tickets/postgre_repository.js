const { insert, updated, fetchByParam, checkSameValueinDb } = require('../../repository/postgres/core_postgres')
const ticketsColumn = require('./column')

class TicketsRepository {
  constructor() {
    this.table = 'tickets'
    this.column = ticketsColumn
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

  async findByTicketNumber(ticketNumber) {
    return await fetchByParam(this.table, { ticket_number: ticketNumber }, Object.values(this.column))
  }

  async findByUserId(userId, filters = {}) {
    const { pgCore } = require('../../config/database')
    let query = pgCore(this.table)
      .where({ user_id: userId })
    
    if (filters.status) {
      query = query.where({ status: filters.status })
    }
    
    if (filters.category_id) {
      query = query.where({ category_id: filters.category_id })
    }
    
    if (filters.priority_id) {
      query = query.where({ priority_id: filters.priority_id })
    }
    
    return await query
      .orderBy('created_at', 'desc')
      .select(Object.values(this.column))
  }

  async findByAssignedTo(assignedTo, filters = {}) {
    const { pgCore } = require('../../config/database')
    let query = pgCore(this.table)
      .where({ assigned_to: assignedTo })
    
    if (filters.status) {
      query = query.where({ status: filters.status })
    }
    
    if (filters.category_id) {
      query = query.where({ category_id: filters.category_id })
    }
    
    if (filters.priority_id) {
      query = query.where({ priority_id: filters.priority_id })
    }
    
    return await query
      .orderBy('created_at', 'desc')
      .select(Object.values(this.column))
  }

  async findAll(filters = {}) {
    const { pgCore } = require('../../config/database')
    let query = pgCore(this.table)
    
    if (filters.status) {
      query = query.where({ status: filters.status })
    }
    
    if (filters.category_id) {
      query = query.where({ category_id: filters.category_id })
    }
    
    if (filters.priority_id) {
      query = query.where({ priority_id: filters.priority_id })
    }
    
    if (filters.assigned_to) {
      query = query.where({ assigned_to: filters.assigned_to })
    }
    
    if (filters.user_id) {
      query = query.where({ user_id: filters.user_id })
    }
    
    if (filters.search) {
      query = query.where(function() {
        this.where('title', 'ilike', `%${filters.search}%`)
          .orWhere('description', 'ilike', `%${filters.search}%`)
          .orWhere('ticket_number', 'ilike', `%${filters.search}%`)
      })
    }
    
    if (filters.date_from) {
      query = query.where('created_at', '>=', filters.date_from)
    }
    
    if (filters.date_to) {
      query = query.where('created_at', '<=', filters.date_to)
    }
    
    return await query
      .orderBy('created_at', 'desc')
      .select(Object.values(this.column))
  }

  async findAllWithDetails(filters = {}) {
    const { pgCore } = require('../../config/database')
    let query = pgCore(this.table)
      .leftJoin('categories', 'tickets.category_id', 'categories.id')
      .leftJoin('priorities', 'tickets.priority_id', 'priorities.id')
      .leftJoin('sla_rules', 'tickets.priority_id', 'sla_rules.priority_id')
      .select(
        'tickets.*',
        'categories.name as category_name',
        'priorities.name as priority_name',
        'priorities.level as priority_level',
        'priorities.color as priority_color',
        'sla_rules.duration_hours as sla_duration_hours'
      )
    
    if (filters.status) {
      query = query.where('tickets.status', filters.status)
    }
    
    if (filters.category_id) {
      query = query.where('tickets.category_id', filters.category_id)
    }
    
    if (filters.priority_id) {
      query = query.where('tickets.priority_id', filters.priority_id)
    }
    
    if (filters.assigned_to) {
      query = query.where('tickets.assigned_to', filters.assigned_to)
    }
    
    if (filters.user_id) {
      query = query.where('tickets.user_id', filters.user_id)
    }
    
    if (filters.search) {
      query = query.where(function() {
        this.where('tickets.title', 'ilike', `%${filters.search}%`)
          .orWhere('tickets.description', 'ilike', `%${filters.search}%`)
          .orWhere('tickets.ticket_number', 'ilike', `%${filters.search}%`)
      })
    }
    
    if (filters.date_from) {
      query = query.where('tickets.created_at', '>=', filters.date_from)
    }
    
    if (filters.date_to) {
      query = query.where('tickets.created_at', '<=', filters.date_to)
    }
    
    return await query
      .orderBy('tickets.created_at', 'desc')
  }

  async getOverdueTickets() {
    const { pgCore } = require('../../config/database')
    const now = new Date()
    
    return await pgCore(this.table)
      .where('sla_deadline', '<', now)
      .whereIn('status', ['open', 'in_progress'])
      .orderBy('sla_deadline', 'asc')
      .select(Object.values(this.column))
  }

  async getTicketStats(filters = {}) {
    const { pgCore } = require('../../config/database')
    let query = pgCore(this.table)
    
    if (filters.date_from) {
      query = query.where('created_at', '>=', filters.date_from)
    }
    
    if (filters.date_to) {
      query = query.where('created_at', '<=', filters.date_to)
    }
    
    const stats = await query
      .select('status')
      .count('* as count')
      .groupBy('status')
    
    return stats
  }

  async generateTicketNumber() {
    const { pgCore } = require('../../config/database')
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    const datePrefix = `${year}${month}${day}`
    
    // Get the last ticket number for today
    const lastTicket = await pgCore(this.table)
      .where('ticket_number', 'like', `TKT-${datePrefix}-%`)
      .orderBy('ticket_number', 'desc')
      .first()
    
    let sequence = 1
    if (lastTicket) {
      const lastSequence = parseInt(lastTicket.ticket_number.split('-')[2])
      sequence = lastSequence + 1
    }
    
    return `TKT-${datePrefix}-${String(sequence).padStart(3, '0')}`
  }
}

module.exports = new TicketsRepository()
