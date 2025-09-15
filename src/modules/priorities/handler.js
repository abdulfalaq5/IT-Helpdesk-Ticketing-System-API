const prioritiesRepository = require('./postgre_repository')
const { createPrioritySchema, updatePrioritySchema, priorityIdSchema, priorityQuerySchema } = require('./validation')
const { successResponse, errorResponse } = require('../../utils/response')

class PrioritiesHandler {
  async createPriority(req, res) {
    try {
      const { error, value } = createPrioritySchema.validate(req.body)
      if (error) {
        return errorResponse(res, 400, error.details[0].message)
      }

      // Check if name already exists
      await prioritiesRepository.checkNameExists(value.name)
      
      // Check if level already exists
      await prioritiesRepository.checkLevelExists(value.level)

      const priority = await prioritiesRepository.create(value)
      return successResponse(res, 201, 'Prioritas berhasil dibuat', priority)
    } catch (err) {
      return errorResponse(res, 400, err.message)
    }
  }

  async updatePriority(req, res) {
    try {
      const { error: paramError, value: paramValue } = priorityIdSchema.validate(req.params)
      if (paramError) {
        return errorResponse(res, 400, paramError.details[0].message)
      }

      const { error, value } = updatePrioritySchema.validate(req.body)
      if (error) {
        return errorResponse(res, 400, error.details[0].message)
      }

      // Check if priority exists
      const existingPriority = await prioritiesRepository.findById(paramValue.id)
      if (!existingPriority) {
        return errorResponse(res, 404, 'Prioritas tidak ditemukan')
      }

      // Check if name already exists (excluding current priority)
      if (value.name && value.name !== existingPriority.name) {
        await prioritiesRepository.checkNameExists(value.name, paramValue.id)
      }

      // Check if level already exists (excluding current priority)
      if (value.level && value.level !== existingPriority.level) {
        await prioritiesRepository.checkLevelExists(value.level, paramValue.id)
      }

      const priority = await prioritiesRepository.update(paramValue.id, value)
      return successResponse(res, 200, 'Prioritas berhasil diperbarui', priority)
    } catch (err) {
      return errorResponse(res, 400, err.message)
    }
  }

  async getPriorityById(req, res) {
    try {
      const { error, value } = priorityIdSchema.validate(req.params)
      if (error) {
        return errorResponse(res, 400, error.details[0].message)
      }

      const priority = await prioritiesRepository.findById(value.id)
      if (!priority) {
        return errorResponse(res, 404, 'Prioritas tidak ditemukan')
      }

      return successResponse(res, 200, 'Prioritas berhasil ditemukan', priority)
    } catch (err) {
      return errorResponse(res, 400, err.message)
    }
  }

  async getAllPriorities(req, res) {
    try {
      const { error, value } = priorityQuerySchema.validate(req.query)
      if (error) {
        return errorResponse(res, 400, error.details[0].message)
      }

      const priorities = await prioritiesRepository.findAll(value)
      return successResponse(res, 200, 'Daftar prioritas berhasil ditemukan', priorities)
    } catch (err) {
      return errorResponse(res, 400, err.message)
    }
  }

  async getActivePriorities(req, res) {
    try {
      const priorities = await prioritiesRepository.findAllActive()
      return successResponse(res, 200, 'Daftar prioritas aktif berhasil ditemukan', priorities)
    } catch (err) {
      return errorResponse(res, 400, err.message)
    }
  }

  async deletePriority(req, res) {
    try {
      const { error, value } = priorityIdSchema.validate(req.params)
      if (error) {
        return errorResponse(res, 400, error.details[0].message)
      }

      // Check if priority exists
      const existingPriority = await prioritiesRepository.findById(value.id)
      if (!existingPriority) {
        return errorResponse(res, 404, 'Prioritas tidak ditemukan')
      }

      // TODO: Check if priority is used in tickets before deleting
      // const ticketsUsingPriority = await ticketsRepository.findByPriorityId(value.id)
      // if (ticketsUsingPriority.length > 0) {
      //   return errorResponse(res, 400, 'Prioritas tidak dapat dihapus karena masih digunakan dalam tiket')
      // }

      await prioritiesRepository.delete(value.id)
      return successResponse(res, 200, 'Prioritas berhasil dihapus')
    } catch (err) {
      return errorResponse(res, 400, err.message)
    }
  }
}

module.exports = new PrioritiesHandler()
