#!/bin/sh

# Replace environment variables in JavaScript files
for file in /usr/share/nginx/html/assets/*.js; do
  # Replace the placeholder with actual environment variable values
  sed -i "s|import.meta.env.VITE_CUBE_API_URL|\"${VITE_CUBE_API_URL}\"|g" $file
  sed -i "s|import.meta.env.VITE_API_BASE_URL|\"${VITE_API_BASE_URL}\"|g" $file
  sed -i "s|import.meta.env.VITE_APP_TITLE|\"${VITE_APP_TITLE}\"|g" $file
done

# Execute the main container command
exec "$@" 