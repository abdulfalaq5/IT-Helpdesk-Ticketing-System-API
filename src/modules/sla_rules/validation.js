const Joi = require('joi')

const createSlaRuleSchema = Joi.object({
  priority_id: Joi.string().uuid().required().messages({
    'string.uuid': 'ID prioritas tidak valid',
    'any.required': 'ID prioritas harus diisi'
  }),
  duration_hours: Joi.number().integer().min(1).max(8760).required().messages({
    'number.base': 'Durasi SLA harus berupa angka',
    'number.integer': 'Durasi SLA harus berupa bilangan bulat',
    'number.min': 'Durasi SLA minimal 1 jam',
    'number.max': 'Durasi SLA maksimal 8760 jam (1 tahun)',
    'any.required': 'Durasi SLA harus diisi'
  }),
  description: Joi.string().max(500).optional().allow('').messages({
    'string.max': 'Deskripsi maksimal 500 karakter'
  }),
  is_active: Joi.boolean().optional().default(true)
})

const updateSlaRuleSchema = Joi.object({
  priority_id: Joi.string().uuid().optional().messages({
    'string.uuid': 'ID prioritas tidak valid'
  }),
  duration_hours: Joi.number().integer().min(1).max(8760).optional().messages({
    'number.base': 'Durasi SLA harus berupa angka',
    'number.integer': 'Durasi SLA harus berupa bilangan bulat',
    'number.min': 'Durasi SLA minimal 1 jam',
    'number.max': 'Durasi SLA maksimal 8760 jam (1 tahun)'
  }),
  description: Joi.string().max(500).optional().allow('').messages({
    'string.max': 'Deskripsi maksimal 500 karakter'
  }),
  is_active: Joi.boolean().optional()
})

const slaRuleIdSchema = Joi.object({
  id: Joi.string().uuid().required().messages({
    'string.uuid': 'ID SLA rule tidak valid',
    'any.required': 'ID SLA rule harus diisi'
  })
})

const slaRuleQuerySchema = Joi.object({
  priority_id: Joi.string().uuid().optional().messages({
    'string.uuid': 'ID prioritas tidak valid'
  }),
  is_active: Joi.boolean().optional()
})

module.exports = {
  createSlaRuleSchema,
  updateSlaRuleSchema,
  slaRuleIdSchema,
  slaRuleQuerySchema
}
