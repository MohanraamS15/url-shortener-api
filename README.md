# URL Shortener API

A robust and secure REST API for creating, managing, and tracking shortened URLs. Built with Node.js, Express, and MongoDB, featuring JWT authentication, rate limiting, admin controls, and automated cleanup of inactive URLs.

## Features

- ✅ User registration and login with JWT tokens
- ✅ Short URL generation with unique 6-character `shortCode`
- ✅ URL validation for `http://` and `https://`
- ✅ Access tracking: `accessCount` and `lastAccessedAt`
- ✅ Public URL lookup by short code
- ✅ URL statistics endpoint
- ✅ Admin-only endpoints for listing, updating, and deleting URLs
- ✅ Daily cleanup of URLs not accessed in 7 days
- ✅ Security with `helmet`, `cors`, and rate limiting
- ✅ Centralized error handling with custom error classes

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **ID Generation**: nanoid
- **Scheduling**: node-cron
- **Security**: helmet, express-rate-limit, cors
- **Validation**: validator
- **Environment**: dotenv
- **Dev Tool**: nodemon

## Project Structure

```
url-shortener-api/
├── app.js
├── package.json
├── .env
├── controllers/
│   ├── authController.js
│   └── urlController.js
├── routes/
│   ├── authRoute.js
│   └── urlRoute.js
├── models/
│   ├── userSchema.js
│   └── urlSchema.js
├── middleware/
│   ├── authenticationMiddleware.js
│   ├── adminMiddleware.js
│   ├── errorHandlerMiddleware.js
│   ├── notFoundMiddleware.js
│   └── urlMiddleware.js
├── errors/
│   ├── BadRequestError.js
│   ├── NotFound.js
│   ├── Unauthenticated.js
│   └── index.js
├── db/
│   └── connect.js
└── cron/
    └── deleteInactiveURL.js
```

## Installation

### Prerequisites

- Node.js
- MongoDB (local or Atlas)
- npm or yarn

### Setup

```bash
git clone https://github.com/MohanraamS15/url-shortener-api.git
cd url-shortener-api
npm install
```

Create a `.env` file:

```env
MONGO_URI=mongodb://username:password@host:port/database
PORT=5000
JWT_SECRET=your_secret_key_here
```

Start the server:

```bash
npm start
```

Server runs on `http://localhost:5000` by default.

## API Endpoints

### Authentication

#### Register

`POST /auth/register`

Body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

Response:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "token": "<jwt_token>"
}
```

#### Login

`POST /auth/login`

Body:

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

Response:

```json
{
  "name": "John Doe",
  "token": "<jwt_token>"
}
```

### URL Management

#### Create Short URL

`POST /shorten`

Headers:

- `Authorization: Bearer <token>`

Body:

```json
{
  "url": "https://www.example.com/long/url"
}
```

Response (201):

```json
{
  "id": "507f1f77bcf86cd799439011",
  "url": "https://www.example.com/long/url",
  "shortCode": "a1b2c3",
  "createdAt": "2026-05-14T10:30:00.000Z",
  "updatedAt": "2026-05-14T10:30:00.000Z",
  "accessCount": 0,
  "lastAccessedAt": "2026-05-14T10:30:00.000Z"
}
```

#### Get URL by Short Code

`GET /shorten/:shortcode`

Response:

```json
{
  "id": "507f1f77bcf86cd799439011",
  "url": "https://www.example.com/long/url",
  "shortCode": "a1b2c3",
  "createdAt": "2026-05-14T10:30:00.000Z",
  "updatedAt": "2026-05-14T10:30:00.000Z"
}
```

> Each request increments `accessCount` and updates `lastAccessedAt`.

#### Get URL Stats

`GET /shorten/:shortcode/stats`

Response:

```json
{
  "id": "507f1f77bcf86cd799439011",
  "url": "https://www.example.com/long/url",
  "shortCode": "a1b2c3",
  "createdAt": "2026-05-14T10:30:00.000Z",
  "updatedAt": "2026-05-14T15:22:00.000Z",
  "accessCount": 42,
  "lastAccessedAt": "2026-05-14T15:22:00.000Z"
}
```

#### Get All URLs (Admin Only)

`GET /shorten`

Headers:

- `Authorization: Bearer <token>`

Response:

```json
{
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "url": "https://www.example.com/long/url",
      "shortCode": "a1b2c3",
      "createdAt": "2026-05-14T10:30:00.000Z",
      "updatedAt": "2026-05-14T10:30:00.000Z"
    }
  ]
}
```

#### Update Short URL (Admin Only)

`PUT /shorten/:shortcode`

Headers:

- `Authorization: Bearer <token>`

Body:

```json
{
  "url": "https://www.newsite.com/updated/path"
}
```

Response:

```json
{
  "id": "507f1f77bcf86cd799439011",
  "url": "https://www.newsite.com/updated/path",
  "shortCode": "a1b2c3",
  "createdAt": "2026-05-14T10:30:00.000Z",
  "updatedAt": "2026-05-14T10:35:00.000Z"
}
```

#### Delete Short URL (Admin Only)

`DELETE /shorten/:shortcode`

Headers:

- `Authorization: Bearer <token>`

Response: `204 No Content`

## Access Control

- Public endpoints: `GET /shorten/:shortcode`, `GET /shorten/:shortcode/stats`
- Authenticated endpoint: `POST /shorten`
- Admin-only endpoints: `GET /shorten`, `PUT /shorten/:shortcode`, `DELETE /shorten/:shortcode`

## Cron Cleanup

The file `cron/deleteInactiveURL.js` runs every night at midnight and removes URLs with `lastAccessedAt` older than 7 days.

## Validation Rules

- URLs must include `http://` or `https://`
- User passwords must contain uppercase letters, lowercase letters, digits, and special characters
- JWT tokens expire after 10 days

## Scripts

- `npm start` — starts the application with `nodemon`
