#!/bin/sh
set -e

# Create data directory if it doesn't exist and set permissions
mkdir -p /app/data
chown -R nextjs:nodejs /app/data
chmod 755 /app/data

# Switch to nextjs user and run the application
exec su-exec nextjs node server.js

