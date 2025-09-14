const express = require('express')
const auth = require('../../modules/auth')
const ssoRoutes = require('./sso')

const routing = express();
const API_TAG = '/api/v1';

/* RULE
naming convention endpoint: using plural
*/

// SSO Routes
routing.use(`${API_TAG}`, ssoRoutes)

// Authentication routes
routing.use(`${API_TAG}/auth`, auth)

module.exports = routing;
