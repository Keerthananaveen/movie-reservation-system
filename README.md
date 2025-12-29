# Movie Reservation System

A full-stack Node.js API for booking movie tickets with integrated payment processing via Stripe.

## Features

- **User Authentication** – Register, login with JWT tokens
- **Movie Management** – Admin can create, update, delete movies
- **Showtimes & Seats** – Create showtimes with auto-generated seat inventory
- **Seat Reservation** – Reserve specific seats with transactional consistency
- **Payment Integration** – Stripe payment intents (test mode or mock)
- **Reservation Management** – View, cancel reservations
- **Role-Based Access** – Admin and User roles

## Project Structure

```
src/
├── app.js
├── server.js
├── config/
│   ├── prisma.js
│   └── stripe.js
├── controllers/
│   ├── auth.controller.js
│   ├── movie.controller.js
│   ├── showtime.controller.js
│   ├── payment.controller.js
│   └── reservation.controller.js
├── middlewares/
│   └── auth.middleware.js
└── routes/
│   ├── auth.routes.js
│    ├── movie.routes.js
│   ├── showtime.routes.js
│   ├── payment.routes.js
│   └── reservation.routes.js
│
prisma/
├── schema.prisma
└── migrations/
│
package.json
.env
```


## Tech Stack

- **Runtime:** Node.js (v20.19.6)
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT
- **Payments:** Stripe SDK
- **Environment:** dotenv

## Installation

### Prerequisites

- Node.js v18+ and npm
- PostgreSQL (local or remote)
- Stripe Account

### Setup

1. **Clone and install:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   Create `.env` in the project root:
   ```env
   PORT=3000
   DATABASE_URL=postgresql://user:password@localhost:5432/movies
   JWT_SECRET=your_secret_key_here
   STRIPE_MOCK=true
   STRIPE_SECRET_KEY=your_stripe_test_key

   ```

   - **DATABASE_URL** – PostgreSQL connection string
   - **JWT_SECRET** – Any random string for signing tokens
   - **STRIPE_MOCK** – Set to `true` for local testing (no real Stripe account needed)
   - **STRIPE_SECRET_KEY** – Real Stripe test key (only if `STRIPE_MOCK=false`)

3. **Initialize database:**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```


## Running the Server

```bash
npm run dev
```

Server starts on `http://localhost:3000`

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login and get JWT token |

### Movies (Admin only for create/update/delete)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/movies` | Get all movies |
| GET | `/movies/:id` | Get movie by ID |
| POST | `/movies` | Create movie (Admin) |
| PUT | `/movies/:id` | Update movie (Admin) |
| DELETE | `/movies/:id` | Delete movie (Admin) |

### Showtimes (Admin only for create/update/delete)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/showtimes` | Get all showtimes |
| GET | `/showtimes/:id` | Get showtime with seats |
| POST | `/showtimes` | Create showtime (Admin) |
| PUT | `/showtimes/:id` | Update showtime (Admin) |
| DELETE | `/showtimes/:id` | Delete showtime (Admin) |

### Payments

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/payments/create-intent` | Create Stripe payment intent |
| POST | `/payments/confirm` | Confirm payment and create reservation |

### Reservations

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/reservations` | Reserve seats |
| GET | `/reservations` | Get user's reservations |
| GET | `/reservations/all` | Get all reservations (Admin) |
| DELETE | `/reservations/:id` | Cancel reservation |

## Database Schema
Database handled using Prisma ORM.PostgreSQL used as the database engine

## Testing with Postman

1. **Set environment variables:**
   - `baseUrl` = `http://localhost:3000`
   - `token` – Auto-populated after Login
   - `adminToken`- Auto-populated after Admin Login
   - `showtimeId` -  Auto-populated after the showTimes creates a ID
   - `paymentIntentId` – Auto-populated after Create Intent

3. **Workflow:**
   - Register → Login → Create Showtime → Create Intent → Confirm Payment → Get Reservations

## Admin Users

Admin users are assigned based on email. Default admin emails:
- `admin@example.com`
- `superadmin@example.com`

Register with these emails to get ADMIN role.

## Mock Stripe Mode

For development without a real Stripe account:

1. Set in `.env`:
   ```env
   STRIPE_MOCK=true
   ```

2. Payment endpoints return mock client secrets and payment intent IDs

3. `confirmPayment` always succeeds (mock status = "succeeded")


