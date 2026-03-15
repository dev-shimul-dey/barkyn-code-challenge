#!/bin/sh
set -e

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
until PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -U "$DB_USERNAME" -d "$DB_NAME" -c '\q' 2>/dev/null; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

echo "PostgreSQL is up - executing migrations and seeds"

# Run migrations
echo "Running database migrations..."
npm run migration:run

# Run seeds
echo "Running database seeds..."
npm run seed

# Start the application
echo "Starting NestJS application..."
exec npm run start:dev
