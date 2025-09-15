const express = require('express')
const prioritiesHandler = require('./handler')

const router = express.Router()

// GET /api/v1/priorities - Get all priorities with filters
router.get('/', prioritiesHandler.getAllPriorities)

// GET /api/v1/priorities/active - Get active priorities only
router.get('/active', prioritiesHandler.getActivePriorities)

// GET /api/v1/priorities/:id - Get priority by ID
router.get('/:id', prioritiesHandler.getPriorityById)

// POST /api/v1/priorities - Create new priority
router.post('/', prioritiesHandler.createPriority)

// PUT /api/v1/priorities/:id - Update priority
router.put('/:id', prioritiesHandler.updatePriority)

// DELETE /api/v1/priorities/:id - Delete priority
router.delete('/:id', prioritiesHandler.deletePriority)

module.exports = router
