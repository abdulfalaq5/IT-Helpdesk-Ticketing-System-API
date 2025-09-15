const Joi = require('joi')

const createTicketSchema = Joi.object({
  category_id: Joi.string().uuid().required().messages({
    'string.uuid': 'ID kategori tidak valid',
    'any.required': 'Kategori harus dipilih'
  }),
  priority_id: Joi.string().uuid().required().messages({
    'string.uuid': 'ID prioritas tidak valid',
    'any.required': 'Prioritas harus dipilih'
  }),
  title: Joi.string().min(5).max(255).required().messages({
    'string.min': 'Judul tiket minimal 5 karakter',
    'string.max': 'Judul tiket maksimal 255 karakter',
    'any.required': 'Judul tiket harus diisi'
  }),
  description: Joi.string().min(10).required().messages({
    'string.min': 'Deskripsi minimal 10 karakter',
    'any.required': 'Deskripsi harus diisi'
  })
})

const updateTicketSchema = Joi.object({
  assigned_to: Joi.string().uuid().optional().allow(null).messages({
    'string.uuid': 'ID user yang ditugaskan tidak valid'
  }),
  status: Joi.string().valid('open', 'in_progress', 'on_hold', 'resolved', 'closed').optional().messages({
    'any.only': 'Status harus salah satu dari: open, in_progress, on_hold, resolved, closed'
  }),
  title: Joi.string().min(5).max(255).optional().messages({
    'string.min': 'Judul tiket minimal 5 karakter',
    'string.max': 'Judul tiket maksimal 255 karakter'
  }),
  description: Joi.string().min(10).optional().messages({
    'string.min': 'Deskripsi minimal 10 karakter'
  })
})

const ticketIdSchema = Joi.object({
  id: Joi.string().uuid().required().messages({
    'string.uuid': 'ID tiket tidak valid',
    'any.required': 'ID tiket harus diisi'
  })
})

const ticketQuerySchema = Joi.object({
  status: Joi.string().valid('open', 'in_progress', 'on_hold', 'resolved', 'closed').optional(),
  category_id: Joi.string().uuid().optional().messages({
    'string.uuid': 'ID kategori tidak valid'
  }),
  priority_id: Joi.string().uuid().optional().messages({
    'string.uuid': 'ID prioritas tidak valid'
  }),
  assigned_to: Joi.string().uuid().optional().messages({
    'string.uuid': 'ID user yang ditugaskan tidak valid'
  }),
  user_id: Joi.string().uuid().optional().messages({
    'string.uuid': 'ID user tidak valid'
  }),
  search: Joi.string().optional().allow(''),
  date_from: Joi.date().optional(),
  date_to: Joi.date().optional(),
  page: Joi.number().integer().min(1).optional().default(1),
  limit: Joi.number().integer().min(1).max(100).optional().default(10)
})

const assignTicketSchema = Joi.object({
  assigned_to: Joi.string().uuid().required().messages({
    'string.uuid': 'ID user yang ditugaskan tidak valid',
    'any.required': 'User yang ditugaskan harus dipilih'
  })
})

module.exports = {
  createTicketSchema,
  updateTicketSchema,
  ticketIdSchema,
  ticketQuerySchema,
  assignTicketSchema
}
