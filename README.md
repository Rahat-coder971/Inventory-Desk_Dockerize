# Three-Tier CRUD Application

A medium-sized CRUD application using:

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB + Mongoose

The app manages product inventory records with create, read, update, delete, search, and status filtering.

## Project Structure

```text
client/   React frontend application
server/   Node.js, Express API, and MongoDB data layer
```

## Setup

Install frontend dependencies:

```bash
cd client
npm install
```

Install backend dependencies:

```bash
cd ../server
npm install
```

Create `server/.env` from the example if it does not exist:

```bash
cp .env.example .env
```

Update `MONGO_URI` if needed. For local MongoDB, the default is:

```text
mongodb://127.0.0.1:27017/doc_3tier_app
```

## Run The App

Start the backend:

```bash
cd server
npm run dev
```

Backend health check:

```text
http://localhost:5000/api/health
```

Start the frontend in a second terminal:

```bash
cd client
npm run dev
```

Frontend: `http://localhost:5173`

Backend API: `http://localhost:5000/api/products`

Optional seed data:

```bash
cd server
npm run seed
```

## API Endpoints

- `GET /api/products` - list products
- `GET /api/products/:id` - get one product
- `POST /api/products` - create product
- `PUT /api/products/:id` - update product
- `DELETE /api/products/:id` - delete product
