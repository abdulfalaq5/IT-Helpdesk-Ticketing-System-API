const { insert, fetchByParam } = require('../../repository/postgres/core_postgres')
const ticketCommentsColumn = require('./column')

class TicketCommentsRepository {
  constructor() {
    this.table = 'ticket_comments'
    this.column = ticketCommentsColumn
  }

  async create(payload) {
    return await insert(this.table, payload, Object.values(this.column))
  }

  async findById(id) {
    return await fetchByParam(this.table, { id }, Object.values(this.column))
  }

  async findByTicketId(ticketId, filters = {}) {
    const { pgCore } = require('../../config/database')
    let query = pgCore(this.table)
      .where({ ticket_id: ticketId })
    
    // Filter internal comments based on user role
    if (filters.hide_internal) {
      query = query.where({ is_internal: false })
    }
    
    return await query
      .orderBy('created_at', 'asc')
      .select(Object.values(this.column))
  }

  async findByTicketIdWithUser(ticketId, filters = {}) {
    const { pgCore } = require('../../config/database')
    let query = pgCore(this.table)
      .leftJoin('users', 'ticket_comments.user_id', 'users.user_id')
      .where('ticket_comments.ticket_id', ticketId)
      .select(
        'ticket_comments.*',
        'users.user_name as user_name',
        'users.user_email as user_email'
      )
    
    // Filter internal comments based on user role
    if (filters.hide_internal) {
      query = query.where('ticket_comments.is_internal', false)
    }
    
    return await query
      .orderBy('ticket_comments.created_at', 'asc')
  }

  async getCommentCountByTicketId(ticketId) {
    const { pgCore } = require('../../config/database')
    const result = await pgCore(this.table)
      .where({ ticket_id: ticketId })
      .count('* as count')
      .first()
    
    return parseInt(result.count)
  }

  async getRecentComments(limit = 10) {
    const { pgCore } = require('../../config/database')
    return await pgCore(this.table)
      .leftJoin('users', 'ticket_comments.user_id', 'users.user_id')
      .leftJoin('tickets', 'ticket_comments.ticket_id', 'tickets.id')
      .select(
        'ticket_comments.*',
        'users.user_name as user_name',
        'users.user_email as user_email',
        'tickets.ticket_number',
        'tickets.title as ticket_title'
      )
      .orderBy('ticket_comments.created_at', 'desc')
      .limit(limit)
  }
}

module.exports = new TicketCommentsRepository()
