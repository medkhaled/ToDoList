#!/bin/sh

echo "⏳ Waiting for PostgreSQL at $DB_HOST:$DB_PORT..."
until nc -z $DB_HOST $DB_PORT; do
  sleep 1
done

echo "✅ Database is up. Starting backend..."
gunicorn --bind 0.0.0.0:5000 app:app
