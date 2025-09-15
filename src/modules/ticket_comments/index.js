const express = require('express')
const ticketCommentsHandler = require('./handler')

const router = express.Router()

// GET /api/v1/ticket-comments/recent - Get recent comments (admin/staff only)
router.get('/recent', ticketCommentsHandler.getRecentComments)

// GET /api/v1/ticket-comments/ticket/:ticket_id - Get comments by ticket ID
router.get('/ticket/:ticket_id', ticketCommentsHandler.getCommentsByTicketId)

// GET /api/v1/ticket-comments/ticket/:ticket_id/count - Get comment count by ticket ID
router.get('/ticket/:ticket_id/count', ticketCommentsHandler.getCommentCount)

// GET /api/v1/ticket-comments/:id - Get comment by ID
router.get('/:id', ticketCommentsHandler.getCommentById)

// POST /api/v1/ticket-comments - Create new comment
router.post('/', ticketCommentsHandler.createComment)

module.exports = router
