const express = require('express')
const ticketAttachmentsHandler = require('./handler')
const { handleTicketFileUpload } = require('../../middlewares/ticketFileUpload')

const router = express.Router()

// GET /api/v1/ticket-attachments/recent - Get recent attachments (admin/staff only)
router.get('/recent', ticketAttachmentsHandler.getRecentAttachments)

// GET /api/v1/ticket-attachments/ticket/:ticket_id - Get attachments by ticket ID
router.get('/ticket/:ticket_id', ticketAttachmentsHandler.getAttachmentsByTicketId)

// GET /api/v1/ticket-attachments/ticket/:ticket_id/count - Get attachment count by ticket ID
router.get('/ticket/:ticket_id/count', ticketAttachmentsHandler.getAttachmentCount)

// GET /api/v1/ticket-attachments/:id - Get attachment by ID
router.get('/:id', ticketAttachmentsHandler.getAttachmentById)

// POST /api/v1/ticket-attachments/upload - Upload multiple files
router.post('/upload', handleTicketFileUpload, ticketAttachmentsHandler.uploadAttachments)

// POST /api/v1/ticket-attachments - Create new attachment record
router.post('/', ticketAttachmentsHandler.createAttachment)

// DELETE /api/v1/ticket-attachments/:id - Delete attachment
router.delete('/:id', ticketAttachmentsHandler.deleteAttachment)

module.exports = router
