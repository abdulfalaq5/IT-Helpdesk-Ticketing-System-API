const express = require('express')
const auth = require('../../modules/auth')
const ssoRoutes = require('./sso')

// Ticketing System Modules
const categories = require('../../modules/categories')
const priorities = require('../../modules/priorities')
const slaRules = require('../../modules/sla_rules')
const tickets = require('../../modules/tickets')
const ticketComments = require('../../modules/ticket_comments')
const ticketAttachments = require('../../modules/ticket_attachments')
const dashboard = require('../../modules/dashboard')

const routing = express();
const API_TAG = '/api/v1';

/* RULE
naming convention endpoint: using plural
*/

// SSO Routes
routing.use(`${API_TAG}`, ssoRoutes)

// Authentication routes
routing.use(`${API_TAG}/auth`, auth)

// Ticketing System Routes
routing.use(`${API_TAG}/categories`, categories)
routing.use(`${API_TAG}/priorities`, priorities)
routing.use(`${API_TAG}/sla-rules`, slaRules)
routing.use(`${API_TAG}/tickets`, tickets)
routing.use(`${API_TAG}/ticket-comments`, ticketComments)
routing.use(`${API_TAG}/ticket-attachments`, ticketAttachments)
routing.use(`${API_TAG}/dashboard`, dashboard)

module.exports = routing;
