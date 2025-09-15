const { sendEmail } = require('../../utils/mail')
const ticketsRepository = require('../tickets/postgre_repository')

class NotificationService {
  async sendTicketCreatedNotification(ticket) {
    try {
      // Get ticket with details
      const tickets = await ticketsRepository.findAllWithDetails({ id: ticket.id })
      if (tickets.length === 0) return

      const ticketWithDetails = tickets[0]

      // TODO: Get IT staff emails from user management system
      const itStaffEmails = [
        'it-support@company.com',
        'helpdesk@company.com'
      ]

      const subject = `Tiket Baru: ${ticketWithDetails.ticket_number} - ${ticketWithDetails.title}`
      
      const htmlContent = `
        <h2>Tiket Baru Dibuat</h2>
        <p>Sebuah tiket baru telah dibuat dengan detail sebagai berikut:</p>
        
        <table style="border-collapse: collapse; width: 100%;">
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Nomor Tiket</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${ticketWithDetails.ticket_number}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Judul</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${ticketWithDetails.title}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Kategori</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${ticketWithDetails.category_name}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Prioritas</td>
            <td style="border: 1px solid #ddd; padding: 8px; color: ${ticketWithDetails.priority_color};">${ticketWithDetails.priority_name}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Status</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${ticketWithDetails.status}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">SLA Deadline</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${new Date(ticketWithDetails.sla_deadline).toLocaleString('id-ID')}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Deskripsi</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${ticketWithDetails.description}</td>
          </tr>
        </table>
        
        <p>Silakan login ke sistem untuk menangani tiket ini.</p>
      `

      // Send email to IT staff
      for (const email of itStaffEmails) {
        await sendEmail(email, subject, htmlContent)
      }

      console.log(`Notification sent for ticket ${ticket.ticket_number}`)
    } catch (error) {
      console.error('Error sending ticket created notification:', error)
    }
  }

  async sendTicketUpdatedNotification(ticket, oldTicket, updatedBy) {
    try {
      // Get ticket with details
      const tickets = await ticketsRepository.findAllWithDetails({ id: ticket.id })
      if (tickets.length === 0) return

      const ticketWithDetails = tickets[0]

      // Determine who should receive the notification
      const recipients = []
      
      // Always notify the requester
      // TODO: Get requester email from user management system
      recipients.push('requester@company.com')

      // If assigned to someone, notify them too
      if (ticket.assigned_to && ticket.assigned_to !== updatedBy) {
        // TODO: Get assigned user email from user management system
        recipients.push('assigned-user@company.com')
      }

      const subject = `Update Tiket: ${ticketWithDetails.ticket_number} - ${ticketWithDetails.title}`
      
      const htmlContent = `
        <h2>Tiket Diperbarui</h2>
        <p>Tiket berikut telah diperbarui:</p>
        
        <table style="border-collapse: collapse; width: 100%;">
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Nomor Tiket</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${ticketWithDetails.ticket_number}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Judul</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${ticketWithDetails.title}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Status</td>
            <td style="border: 1px solid #ddd; padding: 8px;">
              ${oldTicket.status} → ${ticketWithDetails.status}
            </td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Diperbarui Oleh</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${updatedBy}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Waktu Update</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${new Date(ticketWithDetails.updated_at).toLocaleString('id-ID')}</td>
          </tr>
        </table>
        
        <p>Silakan login ke sistem untuk melihat detail lengkap.</p>
      `

      // Send email to recipients
      for (const email of recipients) {
        await sendEmail(email, subject, htmlContent)
      }

      console.log(`Update notification sent for ticket ${ticket.ticket_number}`)
    } catch (error) {
      console.error('Error sending ticket updated notification:', error)
    }
  }

  async sendTicketAssignedNotification(ticket, assignedTo) {
    try {
      // Get ticket with details
      const tickets = await ticketsRepository.findAllWithDetails({ id: ticket.id })
      if (tickets.length === 0) return

      const ticketWithDetails = tickets[0]

      // TODO: Get assigned user email from user management system
      const assignedUserEmail = 'assigned-user@company.com'

      const subject = `Tiket Ditugaskan: ${ticketWithDetails.ticket_number} - ${ticketWithDetails.title}`
      
      const htmlContent = `
        <h2>Tiket Ditugaskan kepada Anda</h2>
        <p>Sebuah tiket telah ditugaskan kepada Anda:</p>
        
        <table style="border-collapse: collapse; width: 100%;">
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Nomor Tiket</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${ticketWithDetails.ticket_number}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Judul</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${ticketWithDetails.title}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Kategori</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${ticketWithDetails.category_name}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Prioritas</td>
            <td style="border: 1px solid #ddd; padding: 8px; color: ${ticketWithDetails.priority_color};">${ticketWithDetails.priority_name}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">SLA Deadline</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${new Date(ticketWithDetails.sla_deadline).toLocaleString('id-ID')}</td>
          </tr>
        </table>
        
        <p>Silakan login ke sistem untuk menangani tiket ini.</p>
      `

      await sendEmail(assignedUserEmail, subject, htmlContent)
      console.log(`Assignment notification sent for ticket ${ticket.ticket_number}`)
    } catch (error) {
      console.error('Error sending ticket assigned notification:', error)
    }
  }

  async sendCommentNotification(comment, ticket) {
    try {
      // Get ticket with details
      const tickets = await ticketsRepository.findAllWithDetails({ id: ticket.id })
      if (tickets.length === 0) return

      const ticketWithDetails = tickets[0]

      // Determine who should receive the notification
      const recipients = []
      
      // Always notify the requester
      // TODO: Get requester email from user management system
      recipients.push('requester@company.com')

      // If assigned to someone, notify them too
      if (ticket.assigned_to) {
        // TODO: Get assigned user email from user management system
        recipients.push('assigned-user@company.com')
      }

      const subject = `Komentar Baru: ${ticketWithDetails.ticket_number} - ${ticketWithDetails.title}`
      
      const htmlContent = `
        <h2>Komentar Baru pada Tiket</h2>
        <p>Sebuah komentar baru telah ditambahkan pada tiket:</p>
        
        <table style="border-collapse: collapse; width: 100%;">
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Nomor Tiket</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${ticketWithDetails.ticket_number}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Judul</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${ticketWithDetails.title}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Komentar</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${comment.comment}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Dari</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${comment.user_id}</td>
          </tr>
        </table>
        
        <p>Silakan login ke sistem untuk melihat komentar lengkap.</p>
      `

      // Send email to recipients
      for (const email of recipients) {
        await sendEmail(email, subject, htmlContent)
      }

      console.log(`Comment notification sent for ticket ${ticket.ticket_number}`)
    } catch (error) {
      console.error('Error sending comment notification:', error)
    }
  }

  async sendSlaReminderNotification(ticket) {
    try {
      // Get ticket with details
      const tickets = await ticketsRepository.findAllWithDetails({ id: ticket.id })
      if (tickets.length === 0) return

      const ticketWithDetails = tickets[0]

      // TODO: Get IT staff emails from user management system
      const itStaffEmails = [
        'it-support@company.com',
        'helpdesk@company.com'
      ]

      const subject = `Pengingat SLA: ${ticketWithDetails.ticket_number} - ${ticketWithDetails.title}`
      
      const htmlContent = `
        <h2>Pengingat SLA</h2>
        <p>Tiket berikut mendekati atau telah melewati SLA deadline:</p>
        
        <table style="border-collapse: collapse; width: 100%;">
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Nomor Tiket</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${ticketWithDetails.ticket_number}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Judul</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${ticketWithDetails.title}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Prioritas</td>
            <td style="border: 1px solid #ddd; padding: 8px; color: ${ticketWithDetails.priority_color};">${ticketWithDetails.priority_name}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">SLA Deadline</td>
            <td style="border: 1px solid #ddd; padding: 8px; color: red;">${new Date(ticketWithDetails.sla_deadline).toLocaleString('id-ID')}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Status</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${ticketWithDetails.status}</td>
          </tr>
        </table>
        
        <p style="color: red; font-weight: bold;">Segera tangani tiket ini untuk memenuhi SLA!</p>
      `

      // Send email to IT staff
      for (const email of itStaffEmails) {
        await sendEmail(email, subject, htmlContent)
      }

      console.log(`SLA reminder sent for ticket ${ticket.ticket_number}`)
    } catch (error) {
      console.error('Error sending SLA reminder notification:', error)
    }
  }
}

module.exports = new NotificationService()
