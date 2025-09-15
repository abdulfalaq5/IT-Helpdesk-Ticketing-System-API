const ticketsRepository = require('./postgre_repository')
const { createTicketSchema, updateTicketSchema, ticketIdSchema, ticketQuerySchema, assignTicketSchema } = require('./validation')
const { successResponse, errorResponse } = require('../../utils/response')
const slaRulesRepository = require('../sla_rules/postgre_repository')

class TicketsHandler {
  async createTicket(req, res) {
    try {
      const { error, value } = createTicketSchema.validate(req.body)
      if (error) {
        return errorResponse(res, 400, error.details[0].message)
      }

      // Get user ID from SSO token (assuming it's in req.user)
      const userId = req.user?.id || req.user?.sub
      if (!userId) {
        return errorResponse(res, 401, 'User tidak terautentikasi')
      }

      // Generate ticket number
      const ticketNumber = await ticketsRepository.generateTicketNumber()

      // Get SLA rule for the priority
      const slaRule = await slaRulesRepository.findByPriorityId(value.priority_id)
      if (!slaRule) {
        return errorResponse(res, 400, 'SLA rule untuk prioritas ini tidak ditemukan')
      }

      // Calculate SLA deadline
      const slaDeadline = new Date()
      slaDeadline.setHours(slaDeadline.getHours() + slaRule.duration_hours)

      const ticketData = {
        ...value,
        user_id: userId,
        ticket_number: ticketNumber,
        sla_deadline: slaDeadline,
        status: 'open'
      }

      const ticket = await ticketsRepository.create(ticketData)
      
      // TODO: Send notification to IT staff
      // await this.sendNotificationToITStaff(ticket)

      return successResponse(res, 201, 'Tiket berhasil dibuat', ticket)
    } catch (err) {
      return errorResponse(res, 400, err.message)
    }
  }

  async updateTicket(req, res) {
    try {
      const { error: paramError, value: paramValue } = ticketIdSchema.validate(req.params)
      if (paramError) {
        return errorResponse(res, 400, paramError.details[0].message)
      }

      const { error, value } = updateTicketSchema.validate(req.body)
      if (error) {
        return errorResponse(res, 400, error.details[0].message)
      }

      // Check if ticket exists
      const existingTicket = await ticketsRepository.findById(paramValue.id)
      if (!existingTicket) {
        return errorResponse(res, 404, 'Tiket tidak ditemukan')
      }

      // Check if user has permission to update this ticket
      const userId = req.user?.id || req.user?.sub
      const userRole = req.user?.role || req.user?.scope
      
      if (existingTicket.user_id !== userId && !['admin', 'manager', 'staff'].includes(userRole)) {
        return errorResponse(res, 403, 'Anda tidak memiliki izin untuk mengupdate tiket ini')
      }

      // Handle status changes
      if (value.status) {
        if (value.status === 'resolved') {
          value.resolved_at = new Date()
        } else if (value.status === 'closed') {
          value.closed_at = new Date()
        }
      }

      const ticket = await ticketsRepository.update(paramValue.id, value)
      
      // TODO: Send notification to requester
      // await this.sendNotificationToRequester(ticket)

      return successResponse(res, 200, 'Tiket berhasil diperbarui', ticket)
    } catch (err) {
      return errorResponse(res, 400, err.message)
    }
  }

  async assignTicket(req, res) {
    try {
      const { error: paramError, value: paramValue } = ticketIdSchema.validate(req.params)
      if (paramError) {
        return errorResponse(res, 400, paramError.details[0].message)
      }

      const { error, value } = assignTicketSchema.validate(req.body)
      if (error) {
        return errorResponse(res, 400, error.details[0].message)
      }

      // Check if ticket exists
      const existingTicket = await ticketsRepository.findById(paramValue.id)
      if (!existingTicket) {
        return errorResponse(res, 404, 'Tiket tidak ditemukan')
      }

      // Check if user has permission to assign tickets
      const userRole = req.user?.role || req.user?.scope
      if (!['admin', 'manager', 'staff'].includes(userRole)) {
        return errorResponse(res, 403, 'Anda tidak memiliki izin untuk menugaskan tiket')
      }

      const updateData = {
        assigned_to: value.assigned_to,
        status: 'in_progress'
      }

      const ticket = await ticketsRepository.update(paramValue.id, updateData)
      
      // TODO: Send notification to assigned staff
      // await this.sendNotificationToAssignedStaff(ticket)

      return successResponse(res, 200, 'Tiket berhasil ditugaskan', ticket)
    } catch (err) {
      return errorResponse(res, 400, err.message)
    }
  }

  async getTicketById(req, res) {
    try {
      const { error, value } = ticketIdSchema.validate(req.params)
      if (error) {
        return errorResponse(res, 400, error.details[0].message)
      }

      const ticket = await ticketsRepository.findById(value.id)
      if (!ticket) {
        return errorResponse(res, 404, 'Tiket tidak ditemukan')
      }

      // Check if user has permission to view this ticket
      const userId = req.user?.id || req.user?.sub
      const userRole = req.user?.role || req.user?.scope
      
      if (ticket.user_id !== userId && !['admin', 'manager', 'staff'].includes(userRole)) {
        return errorResponse(res, 403, 'Anda tidak memiliki izin untuk melihat tiket ini')
      }

      return successResponse(res, 200, 'Tiket berhasil ditemukan', ticket)
    } catch (err) {
      return errorResponse(res, 400, err.message)
    }
  }

  async getTicketWithDetails(req, res) {
    try {
      const { error, value } = ticketIdSchema.validate(req.params)
      if (error) {
        return errorResponse(res, 400, error.details[0].message)
      }

      const tickets = await ticketsRepository.findAllWithDetails({ id: value.id })
      if (tickets.length === 0) {
        return errorResponse(res, 404, 'Tiket tidak ditemukan')
      }

      const ticket = tickets[0]

      // Check if user has permission to view this ticket
      const userId = req.user?.id || req.user?.sub
      const userRole = req.user?.role || req.user?.scope
      
      if (ticket.user_id !== userId && !['admin', 'manager', 'staff'].includes(userRole)) {
        return errorResponse(res, 403, 'Anda tidak memiliki izin untuk melihat tiket ini')
      }

      return successResponse(res, 200, 'Tiket berhasil ditemukan', ticket)
    } catch (err) {
      return errorResponse(res, 400, err.message)
    }
  }

  async getMyTickets(req, res) {
    try {
      const { error, value } = ticketQuerySchema.validate(req.query)
      if (error) {
        return errorResponse(res, 400, error.details[0].message)
      }

      const userId = req.user?.id || req.user?.sub
      if (!userId) {
        return errorResponse(res, 401, 'User tidak terautentikasi')
      }

      const tickets = await ticketsRepository.findByUserId(userId, value)
      return successResponse(res, 200, 'Daftar tiket Anda berhasil ditemukan', tickets)
    } catch (err) {
      return errorResponse(res, 400, err.message)
    }
  }

  async getAssignedTickets(req, res) {
    try {
      const { error, value } = ticketQuerySchema.validate(req.query)
      if (error) {
        return errorResponse(res, 400, error.details[0].message)
      }

      const userId = req.user?.id || req.user?.sub
      if (!userId) {
        return errorResponse(res, 401, 'User tidak terautentikasi')
      }

      const userRole = req.user?.role || req.user?.scope
      if (!['admin', 'manager', 'staff'].includes(userRole)) {
        return errorResponse(res, 403, 'Anda tidak memiliki izin untuk melihat tiket yang ditugaskan')
      }

      const tickets = await ticketsRepository.findByAssignedTo(userId, value)
      return successResponse(res, 200, 'Daftar tiket yang ditugaskan berhasil ditemukan', tickets)
    } catch (err) {
      return errorResponse(res, 400, err.message)
    }
  }

  async getAllTickets(req, res) {
    try {
      const { error, value } = ticketQuerySchema.validate(req.query)
      if (error) {
        return errorResponse(res, 400, error.details[0].message)
      }

      const userRole = req.user?.role || req.user?.scope
      if (!['admin', 'manager', 'staff'].includes(userRole)) {
        return errorResponse(res, 403, 'Anda tidak memiliki izin untuk melihat semua tiket')
      }

      const tickets = await ticketsRepository.findAllWithDetails(value)
      return successResponse(res, 200, 'Daftar tiket berhasil ditemukan', tickets)
    } catch (err) {
      return errorResponse(res, 400, err.message)
    }
  }

  async getOverdueTickets(req, res) {
    try {
      const userRole = req.user?.role || req.user?.scope
      if (!['admin', 'manager', 'staff'].includes(userRole)) {
        return errorResponse(res, 403, 'Anda tidak memiliki izin untuk melihat tiket overdue')
      }

      const tickets = await ticketsRepository.getOverdueTickets()
      return successResponse(res, 200, 'Daftar tiket overdue berhasil ditemukan', tickets)
    } catch (err) {
      return errorResponse(res, 400, err.message)
    }
  }

  async getTicketStats(req, res) {
    try {
      const userRole = req.user?.role || req.user?.scope
      if (!['admin', 'manager', 'staff'].includes(userRole)) {
        return errorResponse(res, 403, 'Anda tidak memiliki izin untuk melihat statistik tiket')
      }

      const { error, value } = ticketQuerySchema.validate(req.query)
      if (error) {
        return errorResponse(res, 400, error.details[0].message)
      }

      const stats = await ticketsRepository.getTicketStats(value)
      return successResponse(res, 200, 'Statistik tiket berhasil ditemukan', stats)
    } catch (err) {
      return errorResponse(res, 400, err.message)
    }
  }
}

module.exports = new TicketsHandler()
