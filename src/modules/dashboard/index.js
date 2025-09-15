const express = require('express')
const dashboardHandler = require('./handler')

const router = express.Router()

// GET /api/v1/dashboard/user - Get user dashboard
router.get('/user', dashboardHandler.getUserDashboard)

// GET /api/v1/dashboard/staff - Get staff dashboard
router.get('/staff', dashboardHandler.getStaffDashboard)

// GET /api/v1/dashboard/manager - Get manager dashboard
router.get('/manager', dashboardHandler.getManagerDashboard)

// GET /api/v1/dashboard/admin - Get admin dashboard
router.get('/admin', dashboardHandler.getAdminDashboard)

module.exports = router
