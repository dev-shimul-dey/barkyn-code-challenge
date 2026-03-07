# Base image is passed from docker-compose via build args
ARG NODE_IMAGE=node:24-alpine
FROM ${NODE_IMAGE}

WORKDIR /usr/src/app

# Install dependencies first (better Docker layer caching)
COPY package*.json ./
RUN npm install

# Copy the rest of the source
COPY . .

# Build NestJS app
RUN npm run build

# Expose the container port (matches API_CONTAINER_PORT from .env)
EXPOSE 3000

# Start in production mode
CMD ["npm", "run", "start:prod"]