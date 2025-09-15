const express = require('express')
const slaRulesHandler = require('./handler')

const router = express.Router()

// GET /api/v1/sla-rules - Get all SLA rules with filters
router.get('/', slaRulesHandler.getAllSlaRules)

// GET /api/v1/sla-rules/with-priority - Get SLA rules with priority details
router.get('/with-priority', slaRulesHandler.getAllSlaRulesWithPriority)

// GET /api/v1/sla-rules/active - Get active SLA rules only
router.get('/active', slaRulesHandler.getActiveSlaRules)

// GET /api/v1/sla-rules/:id - Get SLA rule by ID
router.get('/:id', slaRulesHandler.getSlaRuleById)

// POST /api/v1/sla-rules - Create new SLA rule
router.post('/', slaRulesHandler.createSlaRule)

// PUT /api/v1/sla-rules/:id - Update SLA rule
router.put('/:id', slaRulesHandler.updateSlaRule)

// DELETE /api/v1/sla-rules/:id - Delete SLA rule
router.delete('/:id', slaRulesHandler.deleteSlaRule)

module.exports = router
