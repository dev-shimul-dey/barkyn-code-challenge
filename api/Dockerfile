# Base image is passed from docker-compose via build args
ARG NODE_IMAGE=node:24-alpine
FROM ${NODE_IMAGE}

WORKDIR /usr/src/app

# Install dependencies first (better Docker layer caching)
COPY package*.json ./
RUN npm install

# Copy the rest of the source
COPY . .

# Keep the runtime entrypoint outside the bind-mounted app directory.
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN sed -i 's/\r$//' /usr/local/bin/entrypoint.sh && chmod +x /usr/local/bin/entrypoint.sh

# Install postgresql client for health checks
RUN apk add --no-cache postgresql-client

# Build NestJS app
RUN npm run build

# Expose the container port (matches API_CONTAINER_PORT from .env)
EXPOSE 3000

# Use entrypoint script to wait for DB, run migrations, and start the app
ENTRYPOINT ["./entrypoint.sh"]