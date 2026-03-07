# Base image is passed from docker-compose via build args
ARG NODE_IMAGE=node:20-alpine
FROM ${NODE_IMAGE}

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# For dev: run Vite dev server
# It will listen on WEB_CONTAINER_PORT (5173 from .env)
EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]