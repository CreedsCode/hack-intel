# Build stage
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm
RUN pnpm install

# Copy source code
COPY . .

# Create a .env file with build-time variables
ARG VITE_APP_TITLE
ARG VITE_CUBE_API_URL
ARG VITE_API_BASE_URL
ARG NODE_ENV

# Create .env file
RUN echo "VITE_APP_TITLE=$VITE_APP_TITLE" > .env && \
    echo "VITE_CUBE_API_URL=$VITE_CUBE_API_URL" >> .env && \
    echo "VITE_API_BASE_URL=$VITE_API_BASE_URL" >> .env && \
    echo "NODE_ENV=$NODE_ENV" >> .env

# Build the application (skipping type checks)
RUN pnpm run build

# Production stage
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Script to replace environment variables at runtime
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"] 