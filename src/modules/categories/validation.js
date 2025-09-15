const Joi = require('joi')

const createCategorySchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Nama kategori minimal 2 karakter',
    'string.max': 'Nama kategori maksimal 100 karakter',
    'any.required': 'Nama kategori harus diisi'
  }),
  description: Joi.string().max(500).optional().allow('').messages({
    'string.max': 'Deskripsi maksimal 500 karakter'
  }),
  is_active: Joi.boolean().optional().default(true)
})

const updateCategorySchema = Joi.object({
  name: Joi.string().min(2).max(100).optional().messages({
    'string.min': 'Nama kategori minimal 2 karakter',
    'string.max': 'Nama kategori maksimal 100 karakter'
  }),
  description: Joi.string().max(500).optional().allow('').messages({
    'string.max': 'Deskripsi maksimal 500 karakter'
  }),
  is_active: Joi.boolean().optional()
})

const categoryIdSchema = Joi.object({
  id: Joi.string().uuid().required().messages({
    'string.uuid': 'ID kategori tidak valid',
    'any.required': 'ID kategori harus diisi'
  })
})

const categoryQuerySchema = Joi.object({
  search: Joi.string().optional().allow(''),
  is_active: Joi.boolean().optional()
})

module.exports = {
  createCategorySchema,
  updateCategorySchema,
  categoryIdSchema,
  categoryQuerySchema
}
