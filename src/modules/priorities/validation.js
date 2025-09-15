const Joi = require('joi')

const createPrioritySchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Nama prioritas minimal 2 karakter',
    'string.max': 'Nama prioritas maksimal 50 karakter',
    'any.required': 'Nama prioritas harus diisi'
  }),
  description: Joi.string().max(500).optional().allow('').messages({
    'string.max': 'Deskripsi maksimal 500 karakter'
  }),
  level: Joi.number().integer().min(1).max(10).required().messages({
    'number.base': 'Level harus berupa angka',
    'number.integer': 'Level harus berupa bilangan bulat',
    'number.min': 'Level minimal 1',
    'number.max': 'Level maksimal 10',
    'any.required': 'Level harus diisi'
  }),
  color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).optional().default('#6c757d').messages({
    'string.pattern.base': 'Format warna harus berupa hex color (#RRGGBB)'
  }),
  is_active: Joi.boolean().optional().default(true)
})

const updatePrioritySchema = Joi.object({
  name: Joi.string().min(2).max(50).optional().messages({
    'string.min': 'Nama prioritas minimal 2 karakter',
    'string.max': 'Nama prioritas maksimal 50 karakter'
  }),
  description: Joi.string().max(500).optional().allow('').messages({
    'string.max': 'Deskripsi maksimal 500 karakter'
  }),
  level: Joi.number().integer().min(1).max(10).optional().messages({
    'number.base': 'Level harus berupa angka',
    'number.integer': 'Level harus berupa bilangan bulat',
    'number.min': 'Level minimal 1',
    'number.max': 'Level maksimal 10'
  }),
  color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).optional().messages({
    'string.pattern.base': 'Format warna harus berupa hex color (#RRGGBB)'
  }),
  is_active: Joi.boolean().optional()
})

const priorityIdSchema = Joi.object({
  id: Joi.string().uuid().required().messages({
    'string.uuid': 'ID prioritas tidak valid',
    'any.required': 'ID prioritas harus diisi'
  })
})

const priorityQuerySchema = Joi.object({
  search: Joi.string().optional().allow(''),
  is_active: Joi.boolean().optional()
})

module.exports = {
  createPrioritySchema,
  updatePrioritySchema,
  priorityIdSchema,
  priorityQuerySchema
}
