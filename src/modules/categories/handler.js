const categoriesRepository = require('./postgre_repository')
const { createCategorySchema, updateCategorySchema, categoryIdSchema, categoryQuerySchema } = require('./validation')
const { successResponse, errorResponse } = require('../../utils/response')
const { validateRequest } = require('../../middlewares/validation')

class CategoriesHandler {
  async createCategory(req, res) {
    try {
      const { error, value } = createCategorySchema.validate(req.body)
      if (error) {
        return errorResponse(res, 400, error.details[0].message)
      }

      // Check if name already exists
      await categoriesRepository.checkNameExists(value.name)

      const category = await categoriesRepository.create(value)
      return successResponse(res, 201, 'Kategori berhasil dibuat', category)
    } catch (err) {
      return errorResponse(res, 400, err.message)
    }
  }

  async updateCategory(req, res) {
    try {
      const { error: paramError, value: paramValue } = categoryIdSchema.validate(req.params)
      if (paramError) {
        return errorResponse(res, 400, paramError.details[0].message)
      }

      const { error, value } = updateCategorySchema.validate(req.body)
      if (error) {
        return errorResponse(res, 400, error.details[0].message)
      }

      // Check if category exists
      const existingCategory = await categoriesRepository.findById(paramValue.id)
      if (!existingCategory) {
        return errorResponse(res, 404, 'Kategori tidak ditemukan')
      }

      // Check if name already exists (excluding current category)
      if (value.name && value.name !== existingCategory.name) {
        await categoriesRepository.checkNameExists(value.name, paramValue.id)
      }

      const category = await categoriesRepository.update(paramValue.id, value)
      return successResponse(res, 200, 'Kategori berhasil diperbarui', category)
    } catch (err) {
      return errorResponse(res, 400, err.message)
    }
  }

  async getCategoryById(req, res) {
    try {
      const { error, value } = categoryIdSchema.validate(req.params)
      if (error) {
        return errorResponse(res, 400, error.details[0].message)
      }

      const category = await categoriesRepository.findById(value.id)
      if (!category) {
        return errorResponse(res, 404, 'Kategori tidak ditemukan')
      }

      return successResponse(res, 200, 'Kategori berhasil ditemukan', category)
    } catch (err) {
      return errorResponse(res, 400, err.message)
    }
  }

  async getAllCategories(req, res) {
    try {
      const { error, value } = categoryQuerySchema.validate(req.query)
      if (error) {
        return errorResponse(res, 400, error.details[0].message)
      }

      const categories = await categoriesRepository.findAll(value)
      return successResponse(res, 200, 'Daftar kategori berhasil ditemukan', categories)
    } catch (err) {
      return errorResponse(res, 400, err.message)
    }
  }

  async getActiveCategories(req, res) {
    try {
      const categories = await categoriesRepository.findAllActive()
      return successResponse(res, 200, 'Daftar kategori aktif berhasil ditemukan', categories)
    } catch (err) {
      return errorResponse(res, 400, err.message)
    }
  }

  async deleteCategory(req, res) {
    try {
      const { error, value } = categoryIdSchema.validate(req.params)
      if (error) {
        return errorResponse(res, 400, error.details[0].message)
      }

      // Check if category exists
      const existingCategory = await categoriesRepository.findById(value.id)
      if (!existingCategory) {
        return errorResponse(res, 404, 'Kategori tidak ditemukan')
      }

      // TODO: Check if category is used in tickets before deleting
      // const ticketsUsingCategory = await ticketsRepository.findByCategoryId(value.id)
      // if (ticketsUsingCategory.length > 0) {
      //   return errorResponse(res, 400, 'Kategori tidak dapat dihapus karena masih digunakan dalam tiket')
      // }

      await categoriesRepository.delete(value.id)
      return successResponse(res, 200, 'Kategori berhasil dihapus')
    } catch (err) {
      return errorResponse(res, 400, err.message)
    }
  }
}

module.exports = new CategoriesHandler()
