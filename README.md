# Barkyn Code Challenge

## Stack
- API: NestJS (Node.js) + typeorm
- Web: React.js + Redux + Tailwind CSS
- Database: PostgreSQL
- Caching: Redis
- Containerization: Docker, Docker Compose

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js v20+ (for local development)

### Setup Environment Files

```bash
# Copy environment files (if not already present)
cp .env.example .env
```

### Start Everything

```bash
docker compose up --build
```

## 🌐 Access URLs

| **Frontend** | http://localhost:5173
| **API** | http://localhost:3000/api


## 🧪 Testing

Run tests for the API:

```bash
# Run specific E2E test (enrollment)
docker exec api npm run test:e2e -- enrollment
```
