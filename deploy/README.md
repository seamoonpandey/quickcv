# QuickCV Production Deployment

This directory contains configuration for deploying QuickCV in production using Docker Compose.

## Services

- **backend**: Flask API server
- **mongo**: MongoDB database

## Usage

1. Build and start the services:

   ```sh
   docker compose up --build -d
   ```

2. The backend will be available at `http://localhost:5000`.
3. MongoDB will be available at `mongodb://localhost:27017/quickcv` (from host) and as `mongodb://mongo:27017/quickcv` (from backend container).

## Environment

- Backend uses `.env.prod` for production settings.
- MongoDB data is persisted in the `mongo_data` Docker volume.

---

**Note:**

- Update `SECRET_KEY` in `.env.prod` before deploying to real production.
- For SSL, reverse proxy, or scaling, further configuration is needed.
