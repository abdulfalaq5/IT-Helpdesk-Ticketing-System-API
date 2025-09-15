const ticketingPaths = {
  // Categories endpoints
  '/api/v1/categories': {
    get: {
      tags: ['Categories'],
      summary: 'Get all categories',
      description: 'Retrieve all categories with optional filtering',
      parameters: [
        {
          name: 'search',
          in: 'query',
          schema: { type: 'string' },
          description: 'Search by name or description'
        },
        {
          name: 'is_active',
          in: 'query',
          schema: { type: 'boolean' },
          description: 'Filter by active status'
        }
      ],
      responses: {
        200: {
          description: 'Categories retrieved successfully',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    properties: {
                      data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Category' }
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    },
    post: {
      tags: ['Categories'],
      summary: 'Create new category',
      description: 'Create a new ticket category (Admin only)',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: { type: 'string', minLength: 2, maxLength: 100 },
                description: { type: 'string', maxLength: 500 },
                is_active: { type: 'boolean', default: true }
              },
              required: ['name']
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Category created successfully',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    properties: {
                      data: { $ref: '#/components/schemas/Category' }
                    }
                  }
                ]
              }
            }
          }
        },
        400: { $ref: '#/components/responses/BadRequest' },
        401: { $ref: '#/components/responses/Unauthorized' },
        403: { $ref: '#/components/responses/Forbidden' }
      }
    }
  },
  
  '/api/v1/categories/active': {
    get: {
      tags: ['Categories'],
      summary: 'Get active categories',
      description: 'Retrieve only active categories',
      responses: {
        200: {
          description: 'Active categories retrieved successfully',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    properties: {
                      data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Category' }
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  },
  
  '/api/v1/categories/{id}': {
    get: {
      tags: ['Categories'],
      summary: 'Get category by ID',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'uuid' }
        }
      ],
      responses: {
        200: {
          description: 'Category retrieved successfully',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    properties: {
                      data: { $ref: '#/components/schemas/Category' }
                    }
                  }
                ]
              }
            }
          }
        },
        404: { $ref: '#/components/responses/NotFound' }
      }
    },
    put: {
      tags: ['Categories'],
      summary: 'Update category',
      description: 'Update an existing category (Admin only)',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'uuid' }
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: { type: 'string', minLength: 2, maxLength: 100 },
                description: { type: 'string', maxLength: 500 },
                is_active: { type: 'boolean' }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Category updated successfully',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    properties: {
                      data: { $ref: '#/components/schemas/Category' }
                    }
                  }
                ]
              }
            }
          }
        },
        400: { $ref: '#/components/responses/BadRequest' },
        401: { $ref: '#/components/responses/Unauthorized' },
        403: { $ref: '#/components/responses/Forbidden' },
        404: { $ref: '#/components/responses/NotFound' }
      }
    },
    delete: {
      tags: ['Categories'],
      summary: 'Delete category',
      description: 'Delete a category (Admin only)',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'uuid' }
        }
      ],
      responses: {
        200: {
          description: 'Category deleted successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiResponse' }
            }
          }
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        403: { $ref: '#/components/responses/Forbidden' },
        404: { $ref: '#/components/responses/NotFound' }
      }
    }
  },
  
  // Priorities endpoints
  '/api/v1/priorities': {
    get: {
      tags: ['Priorities'],
      summary: 'Get all priorities',
      description: 'Retrieve all priorities with optional filtering',
      parameters: [
        {
          name: 'search',
          in: 'query',
          schema: { type: 'string' },
          description: 'Search by name or description'
        },
        {
          name: 'is_active',
          in: 'query',
          schema: { type: 'boolean' },
          description: 'Filter by active status'
        }
      ],
      responses: {
        200: {
          description: 'Priorities retrieved successfully',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    properties: {
                      data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Priority' }
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    },
    post: {
      tags: ['Priorities'],
      summary: 'Create new priority',
      description: 'Create a new ticket priority (Admin only)',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: { type: 'string', minLength: 2, maxLength: 50 },
                description: { type: 'string', maxLength: 500 },
                level: { type: 'integer', minimum: 1, maximum: 10 },
                color: { type: 'string', pattern: '^#[0-9A-Fa-f]{6}$' },
                is_active: { type: 'boolean', default: true }
              },
              required: ['name', 'level']
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Priority created successfully',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    properties: {
                      data: { $ref: '#/components/schemas/Priority' }
                    }
                  }
                ]
              }
            }
          }
        },
        400: { $ref: '#/components/responses/BadRequest' },
        401: { $ref: '#/components/responses/Unauthorized' },
        403: { $ref: '#/components/responses/Forbidden' }
      }
    }
  },
  
  '/api/v1/priorities/active': {
    get: {
      tags: ['Priorities'],
      summary: 'Get active priorities',
      description: 'Retrieve only active priorities',
      responses: {
        200: {
          description: 'Active priorities retrieved successfully',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    properties: {
                      data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Priority' }
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  },
  
  // Tickets endpoints
  '/api/v1/tickets': {
    get: {
      tags: ['Tickets'],
      summary: 'Get all tickets',
      description: 'Retrieve all tickets with filtering (Admin/Staff only)',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'status',
          in: 'query',
          schema: { type: 'string', enum: ['open', 'in_progress', 'on_hold', 'resolved', 'closed'] },
          description: 'Filter by status'
        },
        {
          name: 'category_id',
          in: 'query',
          schema: { type: 'string', format: 'uuid' },
          description: 'Filter by category'
        },
        {
          name: 'priority_id',
          in: 'query',
          schema: { type: 'string', format: 'uuid' },
          description: 'Filter by priority'
        },
        {
          name: 'assigned_to',
          in: 'query',
          schema: { type: 'string', format: 'uuid' },
          description: 'Filter by assigned staff'
        },
        {
          name: 'search',
          in: 'query',
          schema: { type: 'string' },
          description: 'Search by title, description, or ticket number'
        },
        {
          name: 'page',
          in: 'query',
          schema: { type: 'integer', minimum: 1, default: 1 },
          description: 'Page number'
        },
        {
          name: 'limit',
          in: 'query',
          schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
          description: 'Items per page'
        }
      ],
      responses: {
        200: {
          description: 'Tickets retrieved successfully',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    properties: {
                      data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Ticket' }
                      }
                    }
                  }
                ]
              }
            }
          }
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        403: { $ref: '#/components/responses/Forbidden' }
      }
    },
    post: {
      tags: ['Tickets'],
      summary: 'Create new ticket',
      description: 'Create a new ticket',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateTicketRequest' }
          }
        }
      },
      responses: {
        201: {
          description: 'Ticket created successfully',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    properties: {
                      data: { $ref: '#/components/schemas/Ticket' }
                    }
                  }
                ]
              }
            }
          }
        },
        400: { $ref: '#/components/responses/BadRequest' },
        401: { $ref: '#/components/responses/Unauthorized' }
      }
    }
  },
  
  '/api/v1/tickets/my': {
    get: {
      tags: ['Tickets'],
      summary: 'Get my tickets',
      description: 'Retrieve tickets created by the authenticated user',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'status',
          in: 'query',
          schema: { type: 'string', enum: ['open', 'in_progress', 'on_hold', 'resolved', 'closed'] },
          description: 'Filter by status'
        },
        {
          name: 'category_id',
          in: 'query',
          schema: { type: 'string', format: 'uuid' },
          description: 'Filter by category'
        },
        {
          name: 'priority_id',
          in: 'query',
          schema: { type: 'string', format: 'uuid' },
          description: 'Filter by priority'
        }
      ],
      responses: {
        200: {
          description: 'My tickets retrieved successfully',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    properties: {
                      data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Ticket' }
                      }
                    }
                  }
                ]
              }
            }
          }
        },
        401: { $ref: '#/components/responses/Unauthorized' }
      }
    }
  },
  
  '/api/v1/tickets/assigned': {
    get: {
      tags: ['Tickets'],
      summary: 'Get assigned tickets',
      description: 'Retrieve tickets assigned to the authenticated staff member',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'status',
          in: 'query',
          schema: { type: 'string', enum: ['open', 'in_progress', 'on_hold', 'resolved', 'closed'] },
          description: 'Filter by status'
        }
      ],
      responses: {
        200: {
          description: 'Assigned tickets retrieved successfully',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    properties: {
                      data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Ticket' }
                      }
                    }
                  }
                ]
              }
            }
          }
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        403: { $ref: '#/components/responses/Forbidden' }
      }
    }
  },
  
  '/api/v1/tickets/overdue': {
    get: {
      tags: ['Tickets'],
      summary: 'Get overdue tickets',
      description: 'Retrieve tickets that have exceeded their SLA deadline (Admin/Staff only)',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Overdue tickets retrieved successfully',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    properties: {
                      data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Ticket' }
                      }
                    }
                  }
                ]
              }
            }
          }
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        403: { $ref: '#/components/responses/Forbidden' }
      }
    }
  },
  
  '/api/v1/tickets/{id}': {
    get: {
      tags: ['Tickets'],
      summary: 'Get ticket by ID',
      description: 'Retrieve a specific ticket by ID',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'uuid' }
        }
      ],
      responses: {
        200: {
          description: 'Ticket retrieved successfully',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    properties: {
                      data: { $ref: '#/components/schemas/Ticket' }
                    }
                  }
                ]
              }
            }
          }
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        403: { $ref: '#/components/responses/Forbidden' },
        404: { $ref: '#/components/responses/NotFound' }
      }
    },
    put: {
      tags: ['Tickets'],
      summary: 'Update ticket',
      description: 'Update an existing ticket',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'uuid' }
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/UpdateTicketRequest' }
          }
        }
      },
      responses: {
        200: {
          description: 'Ticket updated successfully',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    properties: {
                      data: { $ref: '#/components/schemas/Ticket' }
                    }
                  }
                ]
              }
            }
          }
        },
        400: { $ref: '#/components/responses/BadRequest' },
        401: { $ref: '#/components/responses/Unauthorized' },
        403: { $ref: '#/components/responses/Forbidden' },
        404: { $ref: '#/components/responses/NotFound' }
      }
    }
  },
  
  '/api/v1/tickets/{id}/assign': {
    put: {
      tags: ['Tickets'],
      summary: 'Assign ticket',
      description: 'Assign a ticket to an IT staff member (Admin/Staff only)',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'uuid' }
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/AssignTicketRequest' }
          }
        }
      },
      responses: {
        200: {
          description: 'Ticket assigned successfully',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    properties: {
                      data: { $ref: '#/components/schemas/Ticket' }
                    }
                  }
                ]
              }
            }
          }
        },
        400: { $ref: '#/components/responses/BadRequest' },
        401: { $ref: '#/components/responses/Unauthorized' },
        403: { $ref: '#/components/responses/Forbidden' },
        404: { $ref: '#/components/responses/NotFound' }
      }
    }
  },
  
  // Ticket Comments endpoints
  '/api/v1/ticket-comments': {
    post: {
      tags: ['Ticket Comments'],
      summary: 'Add comment to ticket',
      description: 'Add a new comment to a ticket',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateCommentRequest' }
          }
        }
      },
      responses: {
        201: {
          description: 'Comment added successfully',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    properties: {
                      data: { $ref: '#/components/schemas/TicketComment' }
                    }
                  }
                ]
              }
            }
          }
        },
        400: { $ref: '#/components/responses/BadRequest' },
        401: { $ref: '#/components/responses/Unauthorized' },
        403: { $ref: '#/components/responses/Forbidden' }
      }
    }
  },
  
  '/api/v1/ticket-comments/ticket/{ticket_id}': {
    get: {
      tags: ['Ticket Comments'],
      summary: 'Get comments by ticket ID',
      description: 'Retrieve all comments for a specific ticket',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'ticket_id',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'uuid' }
        },
        {
          name: 'hide_internal',
          in: 'query',
          schema: { type: 'boolean', default: false },
          description: 'Hide internal comments from regular users'
        }
      ],
      responses: {
        200: {
          description: 'Comments retrieved successfully',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    properties: {
                      data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/TicketComment' }
                      }
                    }
                  }
                ]
              }
            }
          }
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        403: { $ref: '#/components/responses/Forbidden' },
        404: { $ref: '#/components/responses/NotFound' }
      }
    }
  },
  
  // Ticket Attachments endpoints
  '/api/v1/ticket-attachments/upload': {
    post: {
      tags: ['Ticket Attachments'],
      summary: 'Upload files to ticket',
      description: 'Upload multiple files as attachments to a ticket',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                ticket_id: { type: 'string', format: 'uuid' },
                description: { type: 'string', maxLength: 500 },
                files: {
                  type: 'array',
                  items: { type: 'string', format: 'binary' },
                  maxItems: 5,
                  description: 'Files to upload (max 5 files, 10MB each)'
                }
              },
              required: ['ticket_id', 'files']
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Files uploaded successfully',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    properties: {
                      data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/TicketAttachment' }
                      }
                    }
                  }
                ]
              }
            }
          }
        },
        400: { $ref: '#/components/responses/BadRequest' },
        401: { $ref: '#/components/responses/Unauthorized' },
        403: { $ref: '#/components/responses/Forbidden' }
      }
    }
  },
  
  '/api/v1/ticket-attachments/ticket/{ticket_id}': {
    get: {
      tags: ['Ticket Attachments'],
      summary: 'Get attachments by ticket ID',
      description: 'Retrieve all attachments for a specific ticket',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'ticket_id',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'uuid' }
        }
      ],
      responses: {
        200: {
          description: 'Attachments retrieved successfully',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    properties: {
                      data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/TicketAttachment' }
                      }
                    }
                  }
                ]
              }
            }
          }
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        403: { $ref: '#/components/responses/Forbidden' },
        404: { $ref: '#/components/responses/NotFound' }
      }
    }
  },
  
  // Dashboard endpoints
  '/api/v1/dashboard/user': {
    get: {
      tags: ['Dashboard'],
      summary: 'Get user dashboard',
      description: 'Get dashboard data for the authenticated user (requester)',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'User dashboard retrieved successfully',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    properties: {
                      data: {
                        type: 'object',
                        properties: {
                          summary: { $ref: '#/components/schemas/DashboardSummary' },
                          recent_tickets: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Ticket' }
                          },
                          monthly_stats: {
                            type: 'object',
                            properties: {
                              created_this_month: { type: 'integer' },
                              resolved_this_month: { type: 'integer' }
                            }
                          }
                        }
                      }
                    }
                  }
                ]
              }
            }
          }
        },
        401: { $ref: '#/components/responses/Unauthorized' }
      }
    }
  },
  
  '/api/v1/dashboard/staff': {
    get: {
      tags: ['Dashboard'],
      summary: 'Get staff dashboard',
      description: 'Get dashboard data for IT staff',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Staff dashboard retrieved successfully',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    properties: {
                      data: {
                        type: 'object',
                        properties: {
                          summary: { $ref: '#/components/schemas/DashboardSummary' },
                          recent_assigned_tickets: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Ticket' }
                          },
                          overdue_tickets: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Ticket' }
                          },
                          monthly_stats: {
                            type: 'object',
                            properties: {
                              assigned_this_month: { type: 'integer' },
                              resolved_this_month: { type: 'integer' }
                            }
                          }
                        }
                      }
                    }
                  }
                ]
              }
            }
          }
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        403: { $ref: '#/components/responses/Forbidden' }
      }
    }
  },
  
  '/api/v1/dashboard/manager': {
    get: {
      tags: ['Dashboard'],
      summary: 'Get manager dashboard',
      description: 'Get dashboard data for managers',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Manager dashboard retrieved successfully',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    properties: {
                      data: {
                        type: 'object',
                        properties: {
                          summary: { $ref: '#/components/schemas/DashboardSummary' },
                          recent_tickets: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Ticket' }
                          },
                          overdue_tickets: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Ticket' }
                          },
                          recent_comments: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/TicketComment' }
                          },
                          recent_attachments: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/TicketAttachment' }
                          },
                          ticket_stats_by_status: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                status: { type: 'string' },
                                count: { type: 'string' }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                ]
              }
            }
          }
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        403: { $ref: '#/components/responses/Forbidden' }
      }
    }
  },
  
  '/api/v1/dashboard/admin': {
    get: {
      tags: ['Dashboard'],
      summary: 'Get admin dashboard',
      description: 'Get comprehensive dashboard data for administrators',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Admin dashboard retrieved successfully',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    properties: {
                      data: {
                        type: 'object',
                        properties: {
                          summary: { $ref: '#/components/schemas/DashboardSummary' },
                          recent_tickets: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Ticket' }
                          },
                          overdue_tickets: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Ticket' }
                          },
                          recent_comments: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/TicketComment' }
                          },
                          recent_attachments: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/TicketAttachment' }
                          },
                          ticket_stats_by_status: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                status: { type: 'string' },
                                count: { type: 'string' }
                              }
                            }
                          },
                          system_info: {
                            type: 'object',
                            properties: {
                              total_comments: { type: 'integer' },
                              total_attachments: { type: 'integer' },
                              system_health: { type: 'string', enum: ['Good', 'Fair', 'Poor'] }
                            }
                          }
                        }
                      }
                    }
                  }
                ]
              }
            }
          }
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        403: { $ref: '#/components/responses/Forbidden' }
      }
    }
  }
};

module.exports = ticketingPaths;
