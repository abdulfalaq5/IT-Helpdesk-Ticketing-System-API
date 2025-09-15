const slaRulesRepository = require('./postgre_repository')
const { createSlaRuleSchema, updateSlaRuleSchema, slaRuleIdSchema, slaRuleQuerySchema } = require('./validation')
const { successResponse, errorResponse } = require('../../utils/response')

class SlaRulesHandler {
  async createSlaRule(req, res) {
    try {
      const { error, value } = createSlaRuleSchema.validate(req.body)
      if (error) {
        return errorResponse(res, 400, error.details[0].message)
      }

      // Check if SLA rule for this priority already exists
      await slaRulesRepository.checkPriorityExists(value.priority_id)

      const slaRule = await slaRulesRepository.create(value)
      return successResponse(res, 201, 'SLA rule berhasil dibuat', slaRule)
    } catch (err) {
      return errorResponse(res, 400, err.message)
    }
  }

  async updateSlaRule(req, res) {
    try {
      const { error: paramError, value: paramValue } = slaRuleIdSchema.validate(req.params)
      if (paramError) {
        return errorResponse(res, 400, paramError.details[0].message)
      }

      const { error, value } = updateSlaRuleSchema.validate(req.body)
      if (error) {
        return errorResponse(res, 400, error.details[0].message)
      }

      // Check if SLA rule exists
      const existingSlaRule = await slaRulesRepository.findById(paramValue.id)
      if (!existingSlaRule) {
        return errorResponse(res, 404, 'SLA rule tidak ditemukan')
      }

      // Check if priority already has SLA rule (excluding current SLA rule)
      if (value.priority_id && value.priority_id !== existingSlaRule.priority_id) {
        await slaRulesRepository.checkPriorityExists(value.priority_id, paramValue.id)
      }

      const slaRule = await slaRulesRepository.update(paramValue.id, value)
      return successResponse(res, 200, 'SLA rule berhasil diperbarui', slaRule)
    } catch (err) {
      return errorResponse(res, 400, err.message)
    }
  }

  async getSlaRuleById(req, res) {
    try {
      const { error, value } = slaRuleIdSchema.validate(req.params)
      if (error) {
        return errorResponse(res, 400, error.details[0].message)
      }

      const slaRule = await slaRulesRepository.findById(value.id)
      if (!slaRule) {
        return errorResponse(res, 404, 'SLA rule tidak ditemukan')
      }

      return successResponse(res, 200, 'SLA rule berhasil ditemukan', slaRule)
    } catch (err) {
      return errorResponse(res, 400, err.message)
    }
  }

  async getAllSlaRules(req, res) {
    try {
      const { error, value } = slaRuleQuerySchema.validate(req.query)
      if (error) {
        return errorResponse(res, 400, error.details[0].message)
      }

      const slaRules = await slaRulesRepository.findAll(value)
      return successResponse(res, 200, 'Daftar SLA rules berhasil ditemukan', slaRules)
    } catch (err) {
      return errorResponse(res, 400, err.message)
    }
  }

  async getAllSlaRulesWithPriority(req, res) {
    try {
      const slaRules = await slaRulesRepository.findAllWithPriority()
      return successResponse(res, 200, 'Daftar SLA rules dengan prioritas berhasil ditemukan', slaRules)
    } catch (err) {
      return errorResponse(res, 400, err.message)
    }
  }

  async getActiveSlaRules(req, res) {
    try {
      const slaRules = await slaRulesRepository.findAllActive()
      return successResponse(res, 200, 'Daftar SLA rules aktif berhasil ditemukan', slaRules)
    } catch (err) {
      return errorResponse(res, 400, err.message)
    }
  }

  async deleteSlaRule(req, res) {
    try {
      const { error, value } = slaRuleIdSchema.validate(req.params)
      if (error) {
        return errorResponse(res, 400, error.details[0].message)
      }

      // Check if SLA rule exists
      const existingSlaRule = await slaRulesRepository.findById(value.id)
      if (!existingSlaRule) {
        return errorResponse(res, 404, 'SLA rule tidak ditemukan')
      }

      await slaRulesRepository.delete(value.id)
      return successResponse(res, 200, 'SLA rule berhasil dihapus')
    } catch (err) {
      return errorResponse(res, 400, err.message)
    }
  }
}

module.exports = new SlaRulesHandler()
