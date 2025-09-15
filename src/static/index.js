const info = {
  description: 'IT Helpdesk / Ticketing System API with SSO Integration - Made with ❤ by <a href="https://github.com/abdulfalaq5" target="_blank">@abdulfalaq5.</a>',
  version: '1.0.0',
  title: 'IT Helpdesk / Ticketing System API Documentation',
  contact: {
    email: ''
  },
  license: {
    name: 'MIT',
    url: 'https://opensource.org/licenses/MIT'
  }
}

const servers = [
  {
    url: '/api/v1/',
    description: 'Development server'
  },
  {
    url: 'https://',
    description: 'Gateway server'
  }
]

// Import schemas
const ssoSchema = require('./schema/sso');
const ticketingSchema = require('./schema/ticketing');

// Import paths
const ssoPaths = require('./path/sso');
const ticketingPaths = require('./path/ticketing');

// Import responses
const commonResponses = require('./responses/common');

// Combine all schemas
const schemas = {
  ...ssoSchema,
  ...ticketingSchema
};

// Combine all paths
const paths = {
  ...ssoPaths,
  ...ticketingPaths
};

const index = {
  openapi: '3.0.0',
  info,
  servers,
  paths,
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas,
    responses: commonResponses
  }
}

module.exports = {
  index
}
