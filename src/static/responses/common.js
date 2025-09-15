const commonResponses = {
  BadRequest: {
    description: 'Bad Request',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ErrorResponse' },
        example: {
          success: false,
          message: 'Validation error message',
          error: 'Detailed error information'
        }
      }
    }
  },
  
  Unauthorized: {
    description: 'Unauthorized',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ErrorResponse' },
        example: {
          success: false,
          message: 'User tidak terautentikasi'
        }
      }
    }
  },
  
  Forbidden: {
    description: 'Forbidden',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ErrorResponse' },
        example: {
          success: false,
          message: 'Anda tidak memiliki izin untuk mengakses resource ini'
        }
      }
    }
  },
  
  NotFound: {
    description: 'Not Found',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ErrorResponse' },
        example: {
          success: false,
          message: 'Resource tidak ditemukan'
        }
      }
    }
  },
  
  InternalServerError: {
    description: 'Internal Server Error',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ErrorResponse' },
        example: {
          success: false,
          message: 'Terjadi kesalahan pada server'
        }
      }
    }
  }
};

module.exports = commonResponses;
