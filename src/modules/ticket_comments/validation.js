const Joi = require('joi')

const createCommentSchema = Joi.object({
  ticket_id: Joi.string().uuid().required().messages({
    'string.uuid': 'ID tiket tidak valid',
    'any.required': 'ID tiket harus diisi'
  }),
  comment: Joi.string().min(1).max(2000).required().messages({
    'string.min': 'Komentar tidak boleh kosong',
    'string.max': 'Komentar maksimal 2000 karakter',
    'any.required': 'Komentar harus diisi'
  }),
  is_internal: Joi.boolean().optional().default(false)
})

const commentIdSchema = Joi.object({
  id: Joi.string().uuid().required().messages({
    'string.uuid': 'ID komentar tidak valid',
    'any.required': 'ID komentar harus diisi'
  })
})

const ticketIdSchema = Joi.object({
  ticket_id: Joi.string().uuid().required().messages({
    'string.uuid': 'ID tiket tidak valid',
    'any.required': 'ID tiket harus diisi'
  })
})

const commentQuerySchema = Joi.object({
  hide_internal: Joi.boolean().optional().default(false)
})

module.exports = {
  createCommentSchema,
  commentIdSchema,
  ticketIdSchema,
  commentQuerySchema
}
