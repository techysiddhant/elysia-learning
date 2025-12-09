#!/bin/sh
set -e

echo "Starting deployment..."

# Run database migrations
echo "Running database migrations..."
if [ -f "drizzle.config.ts" ]; then
    bun run db:migrate
else
    echo "Warning: drizzle.config.ts not found, skipping specific migration command."
fi

# Start the application
echo "Starting Elysia app..."
exec bun run server.js
