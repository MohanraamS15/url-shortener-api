# URL Shortener API

A robust and secure REST API for creating, managing, and tracking shortened URLs. Built with Node.js, Express, and MongoDB, featuring JWT authentication, rate limiting, and automated cleanup of inactive URLs.

## Features

✅ **User Authentication** - Register and login with JWT tokens  
✅ **URL Shortening** - Generate unique 6-character short codes using nanoid  
✅ **URL Retrieval** - Redirect and track access to shortened URLs  
✅ **Access Tracking** - Monitor access count and last accessed timestamp  
✅ **URL Management** - Update and delete shortened URLs  
✅ **URL Statistics** - Get detailed stats for each shortened URL  
✅ **Automatic Cleanup** - Removes inactive URLs (not accessed in 7 days) via cron job  
✅ **Security** - JWT authentication, rate limiting, CORS, and helmet protection  
✅ **Input Validation** - URL validation middleware to ensure valid inputs  
✅ **Error Handling** - Comprehensive error handling with custom error classes  

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js v5.2.1
- **Database**: MongoDB with Mongoose v9.6.2
- **Authentication**: JWT (JSON Web Tokens)
- **ID Generation**: nanoid v5.1.11
- **Scheduling**: node-cron v4.2.1
- **Security**: 
  - helmet v8.1.0 (HTTP headers protection)
  - express-rate-limit v8.5.1 (Rate limiting)
  - cors v2.8.6 (Cross-Origin Resource Sharing)
- **Validation**: validator v13.15.35
- **Environment**: dotenv v17.4.2
- **Development**: nodemon v3.1.14

## Project Structure

```
url-shortener-api/
├── app.js                          # Application entry point
├── package.json                    # Project dependencies
├── .env                            # Environment variables
├── controllers/
│   ├── authController.js           # Authentication logic (register, login)
│   └── urlController.js            # URL operations (CRUD, stats)
├── routes/
│   ├── authRoute.js                # Authentication endpoints
│   └── urlRoute.js                 # URL management endpoints
├── models/
│   ├── userSchema.js               # User data schema
│   └── urlSchema.js                # URL data schema
├── middleware/
│   ├── authenticationMiddleware.js  # JWT verification
│   ├── errorHandlerMiddleware.js   # Global error handling
│   ├── notFoundMiddleware.js       # 404 handler
│   └── urlMiddleware.js            # URL validation
├── errors/
│   ├── index.js                    # Error exports
│   ├── BadRequestError.js          # 400 errors
│   ├── NotFound.js                 # 404 errors
│   └── Unauthenticated.js          # 401 errors
├── db/
│   └── connect.js                  # MongoDB connection
└── cron/
    └── deleteInactiveURL.js        # Scheduled cleanup task
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas cluster)
- npm or yarn

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/MohanraamS15/url-shortener-api.git
   cd url-shortener-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   MONGO_URI=mongodb://username:password@host:port/database
   PORT=5000
   JWT_SECRET=your_secret_key_here
   ```

4. **Start the server**
   ```bash
   npm start
   ```

   The server will start on `http://localhost:5000`

## API Endpoints

### Authentication Endpoints

#### Register User
```
POST /auth/register
Content-Type: application/json

Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

Response (201):
{
  "name": "John Doe",
  "email": "john@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login User
```
POST /auth/login
Content-Type: application/json

Body:
{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response (200):
{
  "name": "John Doe",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### URL Endpoints (Requires Authentication)

#### Create Shortened URL
```
POST /shorten
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "url": "https://www.example.com/very/long/url/path"
}

Response (201):
{
  "id": "507f1f77bcf86cd799439011",
  "url": "https://www.example.com/very/long/url/path",
  "shortCode": "a1b2c3",
  "createdAt": "2026-05-14T10:30:00.000Z",
  "updatedAt": "2026-05-14T10:30:00.000Z"
}
```

#### Get URL by Short Code
```
GET /shorten/:id
Authorization: Bearer <token>

Response (200):
{
  "id": "507f1f77bcf86cd799439011",
  "url": "https://www.example.com/very/long/url/path",
  "shortCode": "a1b2c3",
  "createdAt": "2026-05-14T10:30:00.000Z",
  "updatedAt": "2026-05-14T10:30:00.000Z"
}
```

Note: Access count is incremented and last accessed time is updated.

#### Update Shortened URL
```
PUT /shorten/:id
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "url": "https://www.newexample.com/updated/path"
}

Response (200):
{
  "id": "507f1f77bcf86cd799439011",
  "url": "https://www.newexample.com/updated/path",
  "shortCode": "a1b2c3",
  "createdAt": "2026-05-14T10:30:00.000Z",
  "updatedAt": "2026-05-14T10:35:00.000Z"
}
```

#### Delete Shortened URL
```
DELETE /shorten/:id
Authorization: Bearer <token>

Response (204): No Content
```

#### Get URL Statistics
```
GET /shorten/:id/stats
Authorization: Bearer <token>

Response (200):
{
  "id": "507f1f77bcf86cd799439011",
  "url": "https://www.example.com/very/long/url/path",
  "shortCode": "a1b2c3",
  "accessCount": 42,
  "lastAccessedAt": "2026-05-14T15:22:00.000Z",
  "createdAt": "2026-05-14T10:30:00.000Z",
  "updatedAt": "2026-05-14T15:22:00.000Z"
}
```

#### Get All URLs
```
GET /shorten
Authorization: Bearer <token>

Response (200):
[
  {
    "id": "507f1f77bcf86cd799439011",
    "url": "https://www.example.com/very/long/url/path",
    "shortCode": "a1b2c3",
    "createdAt": "2026-05-14T10:30:00.000Z",
    "updatedAt": "2026-05-14T10:30:00.000Z"
  },
  ...
]
```

## Security Features

- **JWT Authentication**: All URL endpoints are protected with JWT authentication
- **Rate Limiting**: 100 requests per 15 minutes per IP address
- **Helmet**: Sets various HTTP headers for security
- **CORS**: Cross-Origin Resource Sharing enabled
- **Input Validation**: URL format validation before database operations
- **Error Handling**: Comprehensive error handling with appropriate HTTP status codes

## Database Schema

### User Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### URL Schema
```javascript
{
  url: String (required, unique),
  shortCode: String (required, unique),
  accessCount: Number (default: 0),
  lastAccessedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Scheduled Tasks

### Automatic URL Cleanup
- **Schedule**: Daily at midnight (0 0 * * *)
- **Action**: Removes URLs that haven't been accessed in 7 days
- **Status**: Logs cleanup activity to console

## Error Handling

The API returns appropriate HTTP status codes and error messages:

| Status | Error | Description |
|--------|-------|-------------|
| 400 | BadRequestError | Invalid input or missing required fields |
| 401 | UnauthenticatedError | Invalid or missing authentication token |
| 404 | NotFoundError | Resource not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Internal server error |

## Usage Examples

### Using cURL

**Register**
```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"pass123"}'
```

**Create Short URL**
```bash
curl -X POST http://localhost:5000/shorten \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.example.com/long/url"}'
```

**Get URL**
```bash
curl -X GET http://localhost:5000/shorten/a1b2c3 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Postman

Import the API endpoints and set the `Authorization` header with your JWT token for protected routes.

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb://user:pass@host:port/db` |
| `PORT` | Server port | `5000` |
| `JWT_SECRET` | Secret key for JWT signing | `your_secret_key` |

## Development

### Run with Nodemon (Auto-restart on changes)
```bash
npm start
```


## Performance Considerations

- **Duplicate URL Detection**: If the same URL is shortened twice, the existing shortened URL is returned
- **Access Tracking**: Each URL access updates the access count and timestamp
- **Automatic Cleanup**: Inactive URLs are automatically removed weekly to maintain database performance
- **Rate Limiting**: Prevents abuse and ensures fair resource usage

## Future Enhancements

- Custom short codes instead of random generation
- URL expiration policies
- Analytics dashboard
- Bulk URL shortening
- API key management
- User quotas and limits
- QR code generation for shortened URLs

## Troubleshooting

### MongoDB Connection Issues
- Verify `MONGO_URI` in `.env` file
- Check MongoDB server is running
- Ensure network access is allowed (if using MongoDB Atlas)

### JWT Token Issues
- Ensure token is included in Authorization header: `Bearer <token>`
- Verify `JWT_SECRET` matches between token creation and verification
- Check token hasn't expired

### Rate Limiting Issues
- Wait 15 minutes for rate limit to reset
- Or adjust `windowMs` and `max` in rate limiter configuration

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Contact

For questions or issues, please open an issue on the GitHub repository.

---

**Happy URL Shortening! 🚀**
