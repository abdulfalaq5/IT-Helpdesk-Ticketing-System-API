const Joi = require('joi')

const createAttachmentSchema = Joi.object({
  ticket_id: Joi.string().uuid().required().messages({
    'string.uuid': 'ID tiket tidak valid',
    'any.required': 'ID tiket harus diisi'
  }),
  file_name: Joi.string().min(1).max(255).required().messages({
    'string.min': 'Nama file tidak boleh kosong',
    'string.max': 'Nama file maksimal 255 karakter',
    'any.required': 'Nama file harus diisi'
  }),
  file_path: Joi.string().min(1).max(500).required().messages({
    'string.min': 'Path file tidak boleh kosong',
    'string.max': 'Path file maksimal 500 karakter',
    'any.required': 'Path file harus diisi'
  }),
  file_type: Joi.string().max(100).optional().allow('').messages({
    'string.max': 'Tipe file maksimal 100 karakter'
  }),
  file_size: Joi.number().integer().min(0).optional().default(0).messages({
    'number.base': 'Ukuran file harus berupa angka',
    'number.integer': 'Ukuran file harus berupa bilangan bulat',
    'number.min': 'Ukuran file tidak boleh negatif'
  }),
  description: Joi.string().max(500).optional().allow('').messages({
    'string.max': 'Deskripsi maksimal 500 karakter'
  })
})

const attachmentIdSchema = Joi.object({
  id: Joi.string().uuid().required().messages({
    'string.uuid': 'ID attachment tidak valid',
    'any.required': 'ID attachment harus diisi'
  })
})

const ticketIdSchema = Joi.object({
  ticket_id: Joi.string().uuid().required().messages({
    'string.uuid': 'ID tiket tidak valid',
    'any.required': 'ID tiket harus diisi'
  })
})

const uploadSchema = Joi.object({
  ticket_id: Joi.string().uuid().required().messages({
    'string.uuid': 'ID tiket tidak valid',
    'any.required': 'ID tiket harus diisi'
  }),
  description: Joi.string().max(500).optional().allow('').messages({
    'string.max': 'Deskripsi maksimal 500 karakter'
  })
})

module.exports = {
  createAttachmentSchema,
  attachmentIdSchema,
  ticketIdSchema,
  uploadSchema
}
