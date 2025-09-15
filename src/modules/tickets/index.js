const express = require('express')
const ticketsHandler = require('./handler')

const router = express.Router()

// GET /api/v1/tickets - Get all tickets (admin/staff only)
router.get('/', ticketsHandler.getAllTickets)

// GET /api/v1/tickets/my - Get my tickets (requester)
router.get('/my', ticketsHandler.getMyTickets)

// GET /api/v1/tickets/assigned - Get assigned tickets (staff)
router.get('/assigned', ticketsHandler.getAssignedTickets)

// GET /api/v1/tickets/overdue - Get overdue tickets (admin/staff only)
router.get('/overdue', ticketsHandler.getOverdueTickets)

// GET /api/v1/tickets/stats - Get ticket statistics (admin/staff only)
router.get('/stats', ticketsHandler.getTicketStats)

// GET /api/v1/tickets/:id - Get ticket by ID
router.get('/:id', ticketsHandler.getTicketById)

// GET /api/v1/tickets/:id/details - Get ticket with details
router.get('/:id/details', ticketsHandler.getTicketWithDetails)

// POST /api/v1/tickets - Create new ticket
router.post('/', ticketsHandler.createTicket)

// PUT /api/v1/tickets/:id - Update ticket
router.put('/:id', ticketsHandler.updateTicket)

// PUT /api/v1/tickets/:id/assign - Assign ticket to staff
router.put('/:id/assign', ticketsHandler.assignTicket)

module.exports = router
