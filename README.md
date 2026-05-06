# Three-Tier CRUD Application

A medium-sized CRUD application built using a three-tier architecture.

## Tech Stack

### Frontend
- React
- Vite
- Nginx

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

The application manages product inventory records with:

- Create product
- Read products
- Update product
- Delete product
- Search products
- Status filtering

---

# Project Structure

```text
client/   React frontend application
server/   Node.js + Express API and MongoDB data layer
```

---

# Local Setup (Without Docker)

## Install Frontend Dependencies

```bash
cd client
npm install
```

## Install Backend Dependencies

```bash
cd ../server
npm install
```

---

# Environment Variables

Create `server/.env` from the example file:

```bash
cp .env.example .env
```

Update `MONGO_URI` if needed.

Default local MongoDB connection:

```text
mongodb://127.0.0.1:27017/doc_3tier_app
```

---

# Run The Application Locally

## Start Backend

```bash
cd server
npm run dev
```

Backend Health Check:

```text
http://localhost:5000/api/health
```

---

## Start Frontend

Open another terminal:

```bash
cd client
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

Backend API:

```text
http://localhost:5000/api/products
```

---

# Optional Seed Data

```bash
cd server
npm run seed
```

---

# API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |

---

# Dockerized Setup

The application is fully containerized using Docker and Docker Compose.

## Containers

| Container | Purpose |
|---|---|
| client | React frontend served using Nginx |
| backend | Node.js + Express API |
| mongo | MongoDB database |

---

# Docker Architecture

```text
Browser
   ↓
Frontend Container (React + Nginx)
   ↓
Backend Container (Node.js + Express)
   ↓
MongoDB Container
```

---

# Run Application Using Docker Compose

Make sure Docker Desktop is running.

From the project root directory:

## Start Containers

```bash
docker compose up --build
```

Run in detached mode:

```bash
docker compose up --build -d
```

---

## Stop Containers

```bash
docker compose down
```

---

# Application Ports

| Service | URL |
|---|---|
| Frontend | http://localhost:3001 |
| Backend | http://localhost:3000 |
| MongoDB | mongodb://localhost:27017 |

---

# Docker Features

- Multi-stage Docker builds
- Distroless Node.js runtime for backend
- Nginx container for frontend static file serving
- Persistent MongoDB Docker volume
- Custom Docker network for inter-container communication

---

# Docker Volumes

MongoDB data is persisted using Docker volumes.

Volume name:

```text
mongo_data
```

This ensures database data remains safe even if containers are removed.

---

# Build Docker Images Individually

## Frontend Image

```bash
cd client
docker build -t client_img .
```

## Backend Image

```bash
cd server
docker build -t server_img .
```

---

# Docker Compose Services

```text
mongo
backend
client
```

All services communicate using the Docker internal network:

```text
app-network
```

---

# Backend Health Check

```text
http://localhost:3000/api/health
```

---

# API Example

```text
http://localhost:3000/api/products
```
