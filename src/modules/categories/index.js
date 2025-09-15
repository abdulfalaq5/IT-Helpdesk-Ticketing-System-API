const express = require('express')
const categoriesHandler = require('./handler')
const { validateRequest } = require('../../middlewares/validation')

const router = express.Router()

// GET /api/v1/categories - Get all categories with filters
router.get('/', categoriesHandler.getAllCategories)

// GET /api/v1/categories/active - Get active categories only
router.get('/active', categoriesHandler.getActiveCategories)

// GET /api/v1/categories/:id - Get category by ID
router.get('/:id', categoriesHandler.getCategoryById)

// POST /api/v1/categories - Create new category
router.post('/', categoriesHandler.createCategory)

// PUT /api/v1/categories/:id - Update category
router.put('/:id', categoriesHandler.updateCategory)

// DELETE /api/v1/categories/:id - Delete category
router.delete('/:id', categoriesHandler.deleteCategory)

module.exports = router
