const ticketingSchemas = {
  Category: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'Unique identifier for the category'
      },
      name: {
        type: 'string',
        maxLength: 100,
        description: 'Category name'
      },
      description: {
        type: 'string',
        description: 'Category description'
      },
      is_active: {
        type: 'boolean',
        description: 'Whether the category is active'
      },
      created_at: {
        type: 'string',
        format: 'date-time',
        description: 'Creation timestamp'
      },
      updated_at: {
        type: 'string',
        format: 'date-time',
        description: 'Last update timestamp'
      }
    },
    required: ['id', 'name', 'is_active']
  },
  
  Priority: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'Unique identifier for the priority'
      },
      name: {
        type: 'string',
        maxLength: 50,
        description: 'Priority name'
      },
      description: {
        type: 'string',
        description: 'Priority description'
      },
      level: {
        type: 'integer',
        minimum: 1,
        maximum: 10,
        description: 'Priority level (1=Low, 2=Medium, 3=High, 4=Critical)'
      },
      color: {
        type: 'string',
        pattern: '^#[0-9A-Fa-f]{6}$',
        description: 'Hex color code for priority'
      },
      is_active: {
        type: 'boolean',
        description: 'Whether the priority is active'
      },
      created_at: {
        type: 'string',
        format: 'date-time',
        description: 'Creation timestamp'
      },
      updated_at: {
        type: 'string',
        format: 'date-time',
        description: 'Last update timestamp'
      }
    },
    required: ['id', 'name', 'level', 'is_active']
  },
  
  SlaRule: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'Unique identifier for the SLA rule'
      },
      priority_id: {
        type: 'string',
        format: 'uuid',
        description: 'Priority ID this SLA rule applies to'
      },
      duration_hours: {
        type: 'integer',
        minimum: 1,
        maximum: 8760,
        description: 'SLA duration in hours'
      },
      description: {
        type: 'string',
        description: 'SLA rule description'
      },
      is_active: {
        type: 'boolean',
        description: 'Whether the SLA rule is active'
      },
      created_at: {
        type: 'string',
        format: 'date-time',
        description: 'Creation timestamp'
      },
      updated_at: {
        type: 'string',
        format: 'date-time',
        description: 'Last update timestamp'
      }
    },
    required: ['id', 'priority_id', 'duration_hours', 'is_active']
  },
  
  Ticket: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'Unique identifier for the ticket'
      },
      ticket_number: {
        type: 'string',
        maxLength: 20,
        description: 'Auto-generated ticket number'
      },
      user_id: {
        type: 'string',
        format: 'uuid',
        description: 'ID of the user who created the ticket'
      },
      assigned_to: {
        type: 'string',
        format: 'uuid',
        nullable: true,
        description: 'ID of the IT staff assigned to the ticket'
      },
      category_id: {
        type: 'string',
        format: 'uuid',
        description: 'Category ID'
      },
      priority_id: {
        type: 'string',
        format: 'uuid',
        description: 'Priority ID'
      },
      title: {
        type: 'string',
        maxLength: 255,
        description: 'Ticket title'
      },
      description: {
        type: 'string',
        description: 'Ticket description'
      },
      status: {
        type: 'string',
        enum: ['open', 'in_progress', 'on_hold', 'resolved', 'closed'],
        description: 'Current ticket status'
      },
      sla_deadline: {
        type: 'string',
        format: 'date-time',
        nullable: true,
        description: 'SLA deadline timestamp'
      },
      resolved_at: {
        type: 'string',
        format: 'date-time',
        nullable: true,
        description: 'Resolution timestamp'
      },
      closed_at: {
        type: 'string',
        format: 'date-time',
        nullable: true,
        description: 'Closure timestamp'
      },
      created_at: {
        type: 'string',
        format: 'date-time',
        description: 'Creation timestamp'
      },
      updated_at: {
        type: 'string',
        format: 'date-time',
        description: 'Last update timestamp'
      }
    },
    required: ['id', 'ticket_number', 'user_id', 'category_id', 'priority_id', 'title', 'description', 'status']
  },
  
  TicketComment: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'Unique identifier for the comment'
      },
      ticket_id: {
        type: 'string',
        format: 'uuid',
        description: 'Ticket ID this comment belongs to'
      },
      user_id: {
        type: 'string',
        format: 'uuid',
        description: 'ID of the user who made the comment'
      },
      comment: {
        type: 'string',
        description: 'Comment content'
      },
      is_internal: {
        type: 'boolean',
        description: 'Whether this is an internal comment (IT staff only)'
      },
      created_at: {
        type: 'string',
        format: 'date-time',
        description: 'Creation timestamp'
      }
    },
    required: ['id', 'ticket_id', 'user_id', 'comment']
  },
  
  TicketAttachment: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'Unique identifier for the attachment'
      },
      ticket_id: {
        type: 'string',
        format: 'uuid',
        description: 'Ticket ID this attachment belongs to'
      },
      uploaded_by: {
        type: 'string',
        format: 'uuid',
        description: 'ID of the user who uploaded the file'
      },
      file_name: {
        type: 'string',
        maxLength: 255,
        description: 'Original file name'
      },
      file_path: {
        type: 'string',
        maxLength: 500,
        description: 'File path in storage'
      },
      file_type: {
        type: 'string',
        maxLength: 100,
        description: 'MIME type of the file'
      },
      file_size: {
        type: 'integer',
        description: 'File size in bytes'
      },
      description: {
        type: 'string',
        description: 'File description'
      },
      created_at: {
        type: 'string',
        format: 'date-time',
        description: 'Creation timestamp'
      }
    },
    required: ['id', 'ticket_id', 'uploaded_by', 'file_name', 'file_path']
  },
  
  CreateTicketRequest: {
    type: 'object',
    properties: {
      category_id: {
        type: 'string',
        format: 'uuid',
        description: 'Category ID'
      },
      priority_id: {
        type: 'string',
        format: 'uuid',
        description: 'Priority ID'
      },
      title: {
        type: 'string',
        minLength: 5,
        maxLength: 255,
        description: 'Ticket title'
      },
      description: {
        type: 'string',
        minLength: 10,
        description: 'Ticket description'
      }
    },
    required: ['category_id', 'priority_id', 'title', 'description']
  },
  
  UpdateTicketRequest: {
    type: 'object',
    properties: {
      assigned_to: {
        type: 'string',
        format: 'uuid',
        nullable: true,
        description: 'ID of the IT staff to assign the ticket to'
      },
      status: {
        type: 'string',
        enum: ['open', 'in_progress', 'on_hold', 'resolved', 'closed'],
        description: 'New ticket status'
      },
      title: {
        type: 'string',
        minLength: 5,
        maxLength: 255,
        description: 'Updated ticket title'
      },
      description: {
        type: 'string',
        minLength: 10,
        description: 'Updated ticket description'
      }
    }
  },
  
  AssignTicketRequest: {
    type: 'object',
    properties: {
      assigned_to: {
        type: 'string',
        format: 'uuid',
        description: 'ID of the IT staff to assign the ticket to'
      }
    },
    required: ['assigned_to']
  },
  
  CreateCommentRequest: {
    type: 'object',
    properties: {
      ticket_id: {
        type: 'string',
        format: 'uuid',
        description: 'Ticket ID'
      },
      comment: {
        type: 'string',
        minLength: 1,
        maxLength: 2000,
        description: 'Comment content'
      },
      is_internal: {
        type: 'boolean',
        description: 'Whether this is an internal comment'
      }
    },
    required: ['ticket_id', 'comment']
  },
  
  UploadAttachmentRequest: {
    type: 'object',
    properties: {
      ticket_id: {
        type: 'string',
        format: 'uuid',
        description: 'Ticket ID'
      },
      description: {
        type: 'string',
        maxLength: 500,
        description: 'File description'
      }
    },
    required: ['ticket_id']
  },
  
  DashboardSummary: {
    type: 'object',
    properties: {
      open: {
        type: 'integer',
        description: 'Number of open tickets'
      },
      in_progress: {
        type: 'integer',
        description: 'Number of in-progress tickets'
      },
      resolved: {
        type: 'integer',
        description: 'Number of resolved tickets'
      },
      closed: {
        type: 'integer',
        description: 'Number of closed tickets'
      },
      overdue: {
        type: 'integer',
        description: 'Number of overdue tickets'
      },
      total: {
        type: 'integer',
        description: 'Total number of tickets'
      },
      sla_compliance_percentage: {
        type: 'integer',
        description: 'SLA compliance percentage'
      }
    }
  },
  
  ApiResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        description: 'Whether the request was successful'
      },
      message: {
        type: 'string',
        description: 'Response message'
      },
      data: {
        type: 'object',
        description: 'Response data'
      }
    },
    required: ['success', 'message']
  },
  
  ErrorResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: false,
        description: 'Whether the request was successful'
      },
      message: {
        type: 'string',
        description: 'Error message'
      },
      error: {
        type: 'string',
        description: 'Detailed error information'
      }
    },
    required: ['success', 'message']
  }
};

module.exports = ticketingSchemas;
