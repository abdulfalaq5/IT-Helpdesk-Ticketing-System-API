const ticketCommentsRepository = require('./postgre_repository')
const ticketsRepository = require('../tickets/postgre_repository')
const { createCommentSchema, commentIdSchema, ticketIdSchema, commentQuerySchema } = require('./validation')
const { successResponse, errorResponse } = require('../../utils/response')

class TicketCommentsHandler {
  async createComment(req, res) {
    try {
      const { error, value } = createCommentSchema.validate(req.body)
      if (error) {
        return errorResponse(res, 400, error.details[0].message)
      }

      // Get user ID from SSO token
      const userId = req.user?.id || req.user?.sub
      if (!userId) {
        return errorResponse(res, 401, 'User tidak terautentikasi')
      }

      // Check if ticket exists
      const ticket = await ticketsRepository.findById(value.ticket_id)
      if (!ticket) {
        return errorResponse(res, 404, 'Tiket tidak ditemukan')
      }

      // Check if user has permission to comment on this ticket
      const userRole = req.user?.role || req.user?.scope
      if (ticket.user_id !== userId && !['admin', 'manager', 'staff'].includes(userRole)) {
        return errorResponse(res, 403, 'Anda tidak memiliki izin untuk mengomentari tiket ini')
      }

      // Check if ticket is closed
      if (ticket.status === 'closed') {
        return errorResponse(res, 400, 'Tidak dapat menambahkan komentar pada tiket yang sudah ditutup')
      }

      const commentData = {
        ...value,
        user_id: userId
      }

      const comment = await ticketCommentsRepository.create(commentData)
      
      // TODO: Send notification to relevant parties
      // await this.sendCommentNotification(comment, ticket)

      return successResponse(res, 201, 'Komentar berhasil ditambahkan', comment)
    } catch (err) {
      return errorResponse(res, 400, err.message)
    }
  }

  async getCommentById(req, res) {
    try {
      const { error, value } = commentIdSchema.validate(req.params)
      if (error) {
        return errorResponse(res, 400, error.details[0].message)
      }

      const comment = await ticketCommentsRepository.findById(value.id)
      if (!comment) {
        return errorResponse(res, 404, 'Komentar tidak ditemukan')
      }

      // Check if user has permission to view this comment
      const userId = req.user?.id || req.user?.sub
      const userRole = req.user?.role || req.user?.scope
      
      // Get ticket to check permissions
      const ticket = await ticketsRepository.findById(comment.ticket_id)
      if (!ticket) {
        return errorResponse(res, 404, 'Tiket tidak ditemukan')
      }

      if (ticket.user_id !== userId && !['admin', 'manager', 'staff'].includes(userRole)) {
        return errorResponse(res, 403, 'Anda tidak memiliki izin untuk melihat komentar ini')
      }

      // Hide internal comments from regular users
      if (comment.is_internal && !['admin', 'manager', 'staff'].includes(userRole)) {
        return errorResponse(res, 403, 'Anda tidak memiliki izin untuk melihat komentar internal')
      }

      return successResponse(res, 200, 'Komentar berhasil ditemukan', comment)
    } catch (err) {
      return errorResponse(res, 400, err.message)
    }
  }

  async getCommentsByTicketId(req, res) {
    try {
      const { error: paramError, value: paramValue } = ticketIdSchema.validate(req.params)
      if (paramError) {
        return errorResponse(res, 400, paramError.details[0].message)
      }

      const { error, value } = commentQuerySchema.validate(req.query)
      if (error) {
        return errorResponse(res, 400, error.details[0].message)
      }

      // Check if ticket exists
      const ticket = await ticketsRepository.findById(paramValue.ticket_id)
      if (!ticket) {
        return errorResponse(res, 404, 'Tiket tidak ditemukan')
      }

      // Check if user has permission to view comments
      const userId = req.user?.id || req.user?.sub
      const userRole = req.user?.role || req.user?.scope
      
      if (ticket.user_id !== userId && !['admin', 'manager', 'staff'].includes(userRole)) {
        return errorResponse(res, 403, 'Anda tidak memiliki izin untuk melihat komentar tiket ini')
      }

      // Hide internal comments from regular users
      if (!['admin', 'manager', 'staff'].includes(userRole)) {
        value.hide_internal = true
      }

      const comments = await ticketCommentsRepository.findByTicketIdWithUser(paramValue.ticket_id, value)
      return successResponse(res, 200, 'Komentar tiket berhasil ditemukan', comments)
    } catch (err) {
      return errorResponse(res, 400, err.message)
    }
  }

  async getRecentComments(req, res) {
    try {
      const userRole = req.user?.role || req.user?.scope
      if (!['admin', 'manager', 'staff'].includes(userRole)) {
        return errorResponse(res, 403, 'Anda tidak memiliki izin untuk melihat komentar terbaru')
      }

      const limit = parseInt(req.query.limit) || 10
      const comments = await ticketCommentsRepository.getRecentComments(limit)
      return successResponse(res, 200, 'Komentar terbaru berhasil ditemukan', comments)
    } catch (err) {
      return errorResponse(res, 400, err.message)
    }
  }

  async getCommentCount(req, res) {
    try {
      const { error, value } = ticketIdSchema.validate(req.params)
      if (error) {
        return errorResponse(res, 400, error.details[0].message)
      }

      // Check if ticket exists
      const ticket = await ticketsRepository.findById(value.ticket_id)
      if (!ticket) {
        return errorResponse(res, 404, 'Tiket tidak ditemukan')
      }

      // Check if user has permission to view comment count
      const userId = req.user?.id || req.user?.sub
      const userRole = req.user?.role || req.user?.scope
      
      if (ticket.user_id !== userId && !['admin', 'manager', 'staff'].includes(userRole)) {
        return errorResponse(res, 403, 'Anda tidak memiliki izin untuk melihat jumlah komentar tiket ini')
      }

      const count = await ticketCommentsRepository.getCommentCountByTicketId(value.ticket_id)
      return successResponse(res, 200, 'Jumlah komentar berhasil ditemukan', { count })
    } catch (err) {
      return errorResponse(res, 400, err.message)
    }
  }
}

module.exports = new TicketCommentsHandler()
