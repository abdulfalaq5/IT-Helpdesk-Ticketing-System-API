const ticketsRepository = require('../tickets/postgre_repository')
const ticketCommentsRepository = require('../ticket_comments/postgre_repository')
const ticketAttachmentsRepository = require('../ticket_attachments/postgre_repository')
const { successResponse, errorResponse } = require('../../utils/response')

class DashboardHandler {
  async getUserDashboard(req, res) {
    try {
      const userId = req.user?.id || req.user?.sub
      if (!userId) {
        return errorResponse(res, 401, 'User tidak terautentikasi')
      }

      // Get user's tickets by status
      const [openTickets, inProgressTickets, resolvedTickets, closedTickets] = await Promise.all([
        ticketsRepository.findByUserId(userId, { status: 'open' }),
        ticketsRepository.findByUserId(userId, { status: 'in_progress' }),
        ticketsRepository.findByUserId(userId, { status: 'resolved' }),
        ticketsRepository.findByUserId(userId, { status: 'closed' })
      ])

      // Get recent tickets
      const recentTickets = await ticketsRepository.findByUserId(userId, {})
        .then(tickets => tickets.slice(0, 5))

      // Get ticket statistics for current month
      const currentDate = new Date()
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

      const monthlyTickets = await ticketsRepository.findByUserId(userId, {
        date_from: startOfMonth,
        date_to: endOfMonth
      })

      const dashboard = {
        summary: {
          open: openTickets.length,
          in_progress: inProgressTickets.length,
          resolved: resolvedTickets.length,
          closed: closedTickets.length,
          total: openTickets.length + inProgressTickets.length + resolvedTickets.length + closedTickets.length
        },
        recent_tickets: recentTickets,
        monthly_stats: {
          created_this_month: monthlyTickets.length,
          resolved_this_month: monthlyTickets.filter(t => t.status === 'resolved' || t.status === 'closed').length
        }
      }

      return successResponse(res, 200, 'Dashboard user berhasil ditemukan', dashboard)
    } catch (err) {
      return errorResponse(res, 400, err.message)
    }
  }

  async getStaffDashboard(req, res) {
    try {
      const userId = req.user?.id || req.user?.sub
      if (!userId) {
        return errorResponse(res, 401, 'User tidak terautentikasi')
      }

      const userRole = req.user?.role || req.user?.scope
      if (!['admin', 'manager', 'staff'].includes(userRole)) {
        return errorResponse(res, 403, 'Anda tidak memiliki izin untuk melihat dashboard staff')
      }

      // Get assigned tickets by status
      const [openTickets, inProgressTickets, resolvedTickets, closedTickets] = await Promise.all([
        ticketsRepository.findByAssignedTo(userId, { status: 'open' }),
        ticketsRepository.findByAssignedTo(userId, { status: 'in_progress' }),
        ticketsRepository.findByAssignedTo(userId, { status: 'resolved' }),
        ticketsRepository.findByAssignedTo(userId, { status: 'closed' })
      ])

      // Get overdue tickets
      const overdueTickets = await ticketsRepository.getOverdueTickets()
        .then(tickets => tickets.filter(t => t.assigned_to === userId))

      // Get recent tickets assigned to this staff
      const recentAssignedTickets = await ticketsRepository.findByAssignedTo(userId, {})
        .then(tickets => tickets.slice(0, 5))

      // Get ticket statistics for current month
      const currentDate = new Date()
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

      const monthlyTickets = await ticketsRepository.findByAssignedTo(userId, {
        date_from: startOfMonth,
        date_to: endOfMonth
      })

      const dashboard = {
        summary: {
          open: openTickets.length,
          in_progress: inProgressTickets.length,
          resolved: resolvedTickets.length,
          closed: closedTickets.length,
          overdue: overdueTickets.length,
          total: openTickets.length + inProgressTickets.length + resolvedTickets.length + closedTickets.length
        },
        recent_assigned_tickets: recentAssignedTickets,
        overdue_tickets: overdueTickets,
        monthly_stats: {
          assigned_this_month: monthlyTickets.length,
          resolved_this_month: monthlyTickets.filter(t => t.status === 'resolved' || t.status === 'closed').length
        }
      }

      return successResponse(res, 200, 'Dashboard staff berhasil ditemukan', dashboard)
    } catch (err) {
      return errorResponse(res, 400, err.message)
    }
  }

  async getManagerDashboard(req, res) {
    try {
      const userRole = req.user?.role || req.user?.scope
      if (!['admin', 'manager'].includes(userRole)) {
        return errorResponse(res, 403, 'Anda tidak memiliki izin untuk melihat dashboard manager')
      }

      // Get all tickets statistics
      const ticketStats = await ticketsRepository.getTicketStats()

      // Get overdue tickets
      const overdueTickets = await ticketsRepository.getOverdueTickets()

      // Get recent tickets
      const recentTickets = await ticketsRepository.findAllWithDetails({})
        .then(tickets => tickets.slice(0, 10))

      // Get recent comments
      const recentComments = await ticketCommentsRepository.getRecentComments(10)

      // Get recent attachments
      const recentAttachments = await ticketAttachmentsRepository.getRecentAttachments(10)

      // Calculate SLA compliance
      const totalTickets = ticketStats.reduce((sum, stat) => sum + parseInt(stat.count), 0)
      const resolvedTickets = ticketStats.find(stat => stat.status === 'resolved')?.count || 0
      const closedTickets = ticketStats.find(stat => stat.status === 'closed')?.count || 0
      const completedTickets = parseInt(resolvedTickets) + parseInt(closedTickets)
      const slaCompliance = totalTickets > 0 ? Math.round((completedTickets / totalTickets) * 100) : 0

      const dashboard = {
        summary: {
          total_tickets: totalTickets,
          open: ticketStats.find(stat => stat.status === 'open')?.count || 0,
          in_progress: ticketStats.find(stat => stat.status === 'in_progress')?.count || 0,
          resolved: resolvedTickets,
          closed: closedTickets,
          overdue: overdueTickets.length,
          sla_compliance_percentage: slaCompliance
        },
        recent_tickets: recentTickets,
        overdue_tickets: overdueTickets,
        recent_comments: recentComments,
        recent_attachments: recentAttachments,
        ticket_stats_by_status: ticketStats
      }

      return successResponse(res, 200, 'Dashboard manager berhasil ditemukan', dashboard)
    } catch (err) {
      return errorResponse(res, 400, err.message)
    }
  }

  async getAdminDashboard(req, res) {
    try {
      const userRole = req.user?.role || req.user?.scope
      if (!['admin'].includes(userRole)) {
        return errorResponse(res, 403, 'Anda tidak memiliki izin untuk melihat dashboard admin')
      }

      // Get comprehensive statistics
      const ticketStats = await ticketsRepository.getTicketStats()
      const overdueTickets = await ticketsRepository.getOverdueTickets()
      const recentTickets = await ticketsRepository.findAllWithDetails({})
        .then(tickets => tickets.slice(0, 10))

      // Get system-wide statistics
      const totalTickets = ticketStats.reduce((sum, stat) => sum + parseInt(stat.count), 0)
      const resolvedTickets = ticketStats.find(stat => stat.status === 'resolved')?.count || 0
      const closedTickets = ticketStats.find(stat => stat.status === 'closed')?.count || 0
      const completedTickets = parseInt(resolvedTickets) + parseInt(closedTickets)
      const slaCompliance = totalTickets > 0 ? Math.round((completedTickets / totalTickets) * 100) : 0

      // Get recent activity
      const recentComments = await ticketCommentsRepository.getRecentComments(10)
      const recentAttachments = await ticketAttachmentsRepository.getRecentAttachments(10)

      const dashboard = {
        summary: {
          total_tickets: totalTickets,
          open: ticketStats.find(stat => stat.status === 'open')?.count || 0,
          in_progress: ticketStats.find(stat => stat.status === 'in_progress')?.count || 0,
          resolved: resolvedTickets,
          closed: closedTickets,
          overdue: overdueTickets.length,
          sla_compliance_percentage: slaCompliance
        },
        recent_tickets: recentTickets,
        overdue_tickets: overdueTickets,
        recent_comments: recentComments,
        recent_attachments: recentAttachments,
        ticket_stats_by_status: ticketStats,
        system_info: {
          total_comments: recentComments.length,
          total_attachments: recentAttachments.length,
          system_health: slaCompliance >= 80 ? 'Good' : slaCompliance >= 60 ? 'Fair' : 'Poor'
        }
      }

      return successResponse(res, 200, 'Dashboard admin berhasil ditemukan', dashboard)
    } catch (err) {
      return errorResponse(res, 400, err.message)
    }
  }
}

module.exports = new DashboardHandler()
