const ticketAttachmentsRepository = require('./postgre_repository')
const ticketsRepository = require('../tickets/postgre_repository')
const { createAttachmentSchema, attachmentIdSchema, ticketIdSchema, uploadSchema } = require('./validation')
const { successResponse, errorResponse } = require('../../utils/response')
const { generateTicketFileName, getTicketContentType } = require('../../middlewares/ticketFileUpload')
const { uploadToMinio } = require('../../utils/minio-upload')

class TicketAttachmentsHandler {
  async uploadAttachments(req, res) {
    try {
      const { error, value } = uploadSchema.validate(req.body)
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

      // Check if user has permission to upload attachments to this ticket
      const userRole = req.user?.role || req.user?.scope
      if (ticket.user_id !== userId && !['admin', 'manager', 'staff'].includes(userRole)) {
        return errorResponse(res, 403, 'Anda tidak memiliki izin untuk mengupload file ke tiket ini')
      }

      // Check if ticket is closed
      if (ticket.status === 'closed') {
        return errorResponse(res, 400, 'Tidak dapat mengupload file pada tiket yang sudah ditutup')
      }

      if (!req.files || req.files.length === 0) {
        return errorResponse(res, 400, 'Tidak ada file yang diupload')
      }

      const uploadedAttachments = []

      for (const file of req.files) {
        try {
          // Generate unique filename
          const fileName = generateTicketFileName(file.originalname)
          const contentType = getTicketContentType(file.originalname)

          // Upload to MinIO
          const uploadResult = await uploadToMinio(file.buffer, fileName, contentType)
          
          if (!uploadResult.success) {
            throw new Error(`Gagal mengupload file ${file.originalname}: ${uploadResult.error}`)
          }

          // Save attachment record to database
          const attachmentData = {
            ticket_id: value.ticket_id,
            uploaded_by: userId,
            file_name: file.originalname,
            file_path: uploadResult.path,
            file_type: contentType,
            file_size: file.size,
            description: value.description || ''
          }

          const attachment = await ticketAttachmentsRepository.create(attachmentData)
          uploadedAttachments.push(attachment)

        } catch (fileError) {
          console.error(`Error uploading file ${file.originalname}:`, fileError)
          // Continue with other files even if one fails
        }
      }

      if (uploadedAttachments.length === 0) {
        return errorResponse(res, 400, 'Gagal mengupload semua file')
      }

      return successResponse(res, 201, `${uploadedAttachments.length} file berhasil diupload`, uploadedAttachments)
    } catch (err) {
      return errorResponse(res, 400, err.message)
    }
  }

  async createAttachment(req, res) {
    try {
      const { error, value } = createAttachmentSchema.validate(req.body)
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

      // Check if user has permission to add attachments to this ticket
      const userRole = req.user?.role || req.user?.scope
      if (ticket.user_id !== userId && !['admin', 'manager', 'staff'].includes(userRole)) {
        return errorResponse(res, 403, 'Anda tidak memiliki izin untuk menambahkan attachment ke tiket ini')
      }

      const attachmentData = {
        ...value,
        uploaded_by: userId
      }

      const attachment = await ticketAttachmentsRepository.create(attachmentData)
      return successResponse(res, 201, 'Attachment berhasil ditambahkan', attachment)
    } catch (err) {
      return errorResponse(res, 400, err.message)
    }
  }

  async getAttachmentById(req, res) {
    try {
      const { error, value } = attachmentIdSchema.validate(req.params)
      if (error) {
        return errorResponse(res, 400, error.details[0].message)
      }

      const attachment = await ticketAttachmentsRepository.findById(value.id)
      if (!attachment) {
        return errorResponse(res, 404, 'Attachment tidak ditemukan')
      }

      // Check if user has permission to view this attachment
      const userId = req.user?.id || req.user?.sub
      const userRole = req.user?.role || req.user?.scope
      
      // Get ticket to check permissions
      const ticket = await ticketsRepository.findById(attachment.ticket_id)
      if (!ticket) {
        return errorResponse(res, 404, 'Tiket tidak ditemukan')
      }

      if (ticket.user_id !== userId && !['admin', 'manager', 'staff'].includes(userRole)) {
        return errorResponse(res, 403, 'Anda tidak memiliki izin untuk melihat attachment ini')
      }

      return successResponse(res, 200, 'Attachment berhasil ditemukan', attachment)
    } catch (err) {
      return errorResponse(res, 400, err.message)
    }
  }

  async getAttachmentsByTicketId(req, res) {
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

      // Check if user has permission to view attachments
      const userId = req.user?.id || req.user?.sub
      const userRole = req.user?.role || req.user?.scope
      
      if (ticket.user_id !== userId && !['admin', 'manager', 'staff'].includes(userRole)) {
        return errorResponse(res, 403, 'Anda tidak memiliki izin untuk melihat attachment tiket ini')
      }

      const attachments = await ticketAttachmentsRepository.findByTicketIdWithUser(value.ticket_id)
      return successResponse(res, 200, 'Attachment tiket berhasil ditemukan', attachments)
    } catch (err) {
      return errorResponse(res, 400, err.message)
    }
  }

  async getRecentAttachments(req, res) {
    try {
      const userRole = req.user?.role || req.user?.scope
      if (!['admin', 'manager', 'staff'].includes(userRole)) {
        return errorResponse(res, 403, 'Anda tidak memiliki izin untuk melihat attachment terbaru')
      }

      const limit = parseInt(req.query.limit) || 10
      const attachments = await ticketAttachmentsRepository.getRecentAttachments(limit)
      return successResponse(res, 200, 'Attachment terbaru berhasil ditemukan', attachments)
    } catch (err) {
      return errorResponse(res, 400, err.message)
    }
  }

  async getAttachmentCount(req, res) {
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

      // Check if user has permission to view attachment count
      const userId = req.user?.id || req.user?.sub
      const userRole = req.user?.role || req.user?.scope
      
      if (ticket.user_id !== userId && !['admin', 'manager', 'staff'].includes(userRole)) {
        return errorResponse(res, 403, 'Anda tidak memiliki izin untuk melihat jumlah attachment tiket ini')
      }

      const count = await ticketAttachmentsRepository.getAttachmentCountByTicketId(value.ticket_id)
      const totalSize = await ticketAttachmentsRepository.getTotalFileSizeByTicketId(value.ticket_id)
      
      return successResponse(res, 200, 'Informasi attachment berhasil ditemukan', { 
        count, 
        total_size: totalSize 
      })
    } catch (err) {
      return errorResponse(res, 400, err.message)
    }
  }

  async deleteAttachment(req, res) {
    try {
      const { error, value } = attachmentIdSchema.validate(req.params)
      if (error) {
        return errorResponse(res, 400, error.details[0].message)
      }

      // Check if attachment exists
      const attachment = await ticketAttachmentsRepository.findById(value.id)
      if (!attachment) {
        return errorResponse(res, 404, 'Attachment tidak ditemukan')
      }

      // Check if user has permission to delete this attachment
      const userId = req.user?.id || req.user?.sub
      const userRole = req.user?.role || req.user?.scope
      
      // Get ticket to check permissions
      const ticket = await ticketsRepository.findById(attachment.ticket_id)
      if (!ticket) {
        return errorResponse(res, 404, 'Tiket tidak ditemukan')
      }

      if (attachment.uploaded_by !== userId && !['admin', 'manager'].includes(userRole)) {
        return errorResponse(res, 403, 'Anda tidak memiliki izin untuk menghapus attachment ini')
      }

      // TODO: Delete file from MinIO storage
      // await deleteFromMinio(attachment.file_path)

      await ticketAttachmentsRepository.delete(value.id)
      return successResponse(res, 200, 'Attachment berhasil dihapus')
    } catch (err) {
      return errorResponse(res, 400, err.message)
    }
  }
}

module.exports = new TicketAttachmentsHandler()
