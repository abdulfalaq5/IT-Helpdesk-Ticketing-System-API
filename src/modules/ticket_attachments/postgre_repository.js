const { insert, fetchByParam, deletePermanently } = require('../../repository/postgres/core_postgres')
const ticketAttachmentsColumn = require('./column')

class TicketAttachmentsRepository {
  constructor() {
    this.table = 'ticket_attachments'
    this.column = ticketAttachmentsColumn
  }

  async create(payload) {
    return await insert(this.table, payload, Object.values(this.column))
  }

  async findById(id) {
    return await fetchByParam(this.table, { id }, Object.values(this.column))
  }

  async findByTicketId(ticketId) {
    const { pgCore } = require('../../config/database')
    return await pgCore(this.table)
      .where({ ticket_id: ticketId })
      .orderBy('created_at', 'asc')
      .select(Object.values(this.column))
  }

  async findByTicketIdWithUser(ticketId) {
    const { pgCore } = require('../../config/database')
    return await pgCore(this.table)
      .leftJoin('users', 'ticket_attachments.uploaded_by', 'users.user_id')
      .where('ticket_attachments.ticket_id', ticketId)
      .select(
        'ticket_attachments.*',
        'users.user_name as user_name',
        'users.user_email as user_email'
      )
      .orderBy('ticket_attachments.created_at', 'asc')
  }

  async getAttachmentCountByTicketId(ticketId) {
    const { pgCore } = require('../../config/database')
    const result = await pgCore(this.table)
      .where({ ticket_id: ticketId })
      .count('* as count')
      .first()
    
    return parseInt(result.count)
  }

  async getTotalFileSizeByTicketId(ticketId) {
    const { pgCore } = require('../../config/database')
    const result = await pgCore(this.table)
      .where({ ticket_id: ticketId })
      .sum('file_size as total_size')
      .first()
    
    return parseInt(result.total_size) || 0
  }

  async getRecentAttachments(limit = 10) {
    const { pgCore } = require('../../config/database')
    return await pgCore(this.table)
      .leftJoin('users', 'ticket_attachments.uploaded_by', 'users.user_id')
      .leftJoin('tickets', 'ticket_attachments.ticket_id', 'tickets.id')
      .select(
        'ticket_attachments.*',
        'users.user_name as user_name',
        'users.user_email as user_email',
        'tickets.ticket_number',
        'tickets.title as ticket_title'
      )
      .orderBy('ticket_attachments.created_at', 'desc')
      .limit(limit)
  }

  async delete(id) {
    return await deletePermanently(this.table, { id }, Object.values(this.column))
  }
}

module.exports = new TicketAttachmentsRepository()
