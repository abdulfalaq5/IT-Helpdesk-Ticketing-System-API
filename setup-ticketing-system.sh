#!/bin/bash

# Script untuk menjalankan migration dan seeder untuk IT Helpdesk Ticketing System

echo "🚀 Starting IT Helpdesk Ticketing System Setup..."

# Check if knex is installed
if ! command -v knex &> /dev/null; then
    echo "❌ Knex CLI not found. Installing knex globally..."
    npm install -g knex
fi

# Navigate to project directory
cd "$(dirname "$0")"

echo "📦 Running database migrations..."

# Run migrations
knex migrate:latest

if [ $? -eq 0 ]; then
    echo "✅ Migrations completed successfully!"
else
    echo "❌ Migration failed!"
    exit 1
fi

echo "🌱 Running database seeders..."

# Run seeders
knex seed:run

if [ $? -eq 0 ]; then
    echo "✅ Seeders completed successfully!"
else
    echo "❌ Seeding failed!"
    exit 1
fi

echo "🎉 IT Helpdesk Ticketing System setup completed!"
echo ""
echo "📋 What was created:"
echo "   - Categories table with default categories (Hardware, Software, Network, etc.)"
echo "   - Priorities table with default priorities (Low, Medium, High, Critical)"
echo "   - SLA Rules table with default SLA rules"
echo "   - Tickets table for ticket management"
echo "   - Ticket Comments table for communication"
echo "   - Ticket Attachments table for file uploads"
echo ""
echo "🔗 API Endpoints available:"
echo "   - GET /api/v1/categories - Manage ticket categories"
echo "   - GET /api/v1/priorities - Manage ticket priorities"
echo "   - GET /api/v1/sla-rules - Manage SLA rules"
echo "   - GET /api/v1/tickets - Manage tickets"
echo "   - GET /api/v1/ticket-comments - Manage ticket comments"
echo "   - GET /api/v1/ticket-attachments - Manage ticket attachments"
echo "   - GET /api/v1/dashboard - Dashboard for different roles"
echo ""
echo "📖 See TICKETING_API_DOCUMENTATION.md for complete API documentation"
echo ""
echo "🔐 Authentication:"
echo "   - System uses existing SSO module for authentication"
echo "   - All endpoints require valid SSO token"
echo "   - Role-based access control implemented"
echo ""
echo "🎯 Next steps:"
echo "   1. Configure email settings for notifications"
echo "   2. Set up MinIO for file storage"
echo "   3. Test API endpoints with SSO authentication"
echo "   4. Configure user roles in SSO system"
