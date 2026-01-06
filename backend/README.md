# JobSync Backend API

RESTful API for the JobSync job application tracker built with Node.js, Express, TypeScript, and PostgreSQL.

## 🌐 Live API

**Production:** [https://jobsync-backend-nvya.onrender.com](https://jobsync-backend-nvya.onrender.com/api/health)

## 🛠️ Tech Stack

- **Runtime:** Node.js 24.x
- **Framework:** Express.js
- **Language:** TypeScript 5
- **Database:** PostgreSQL 16
- **ORM:** Prisma 6
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Validation:** Zod
- **CORS:** cors middleware

## 📋 Features

- ✅ **JWT Authentication**: Access + Refresh token strategy
- ✅ **User Management**: Signup, login, profile CRUD
- ✅ **Application CRUD**: Full job application management
- ✅ **Search & Filter**: Query applications by status, company, role
- ✅ **Pagination**: Efficient data loading
- ✅ **Security**: Password hashing, JWT middleware, input validation
- ✅ **Error Handling**: Centralized error middleware
- ✅ **CORS**: Production-ready configuration

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
```

### Environment Variables

Create `.env` with:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/jobsync?schema=public"

JWT_ACCESS_SECRET="your-strong-secret-key"
JWT_REFRESH_SECRET="another-strong-secret-key"
ACCESS_TOKEN_EXPIRY="15m"
REFRESH_TOKEN_EXPIRY="7d"

PORT=5000
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
```

### Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Open Prisma Studio
npx prisma studio
```

### Development

```bash
npm run dev
```

Server runs on [http://localhost:5000](http://localhost:5000)

### Build for Production

```bash
npm run build
npm run start
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── routes/              # API routes
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   └── application.routes.ts
│   ├── controllers/         # Business logic
│   ├── middleware/          # Auth, validation, error handling
│   │   ├── auth.middleware.ts
│   │   ├── validate.middleware.ts
│   │   └── error.middleware.ts
│   ├── config/
│   │   ├── env.ts           # Environment validation
│   │   └── database.ts      # Prisma client
│   └── index.ts             # Server entry point
├── prisma/
│   └── schema.prisma        # Database schema
└── package.json
```

## 🔌 API Endpoints

### Authentication

#### Signup
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

#### Refresh Token
```http
POST /api/auth/refresh
Cookie: refreshToken=<token>
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <access_token>
```

### User Management

#### Get Profile
```http
GET /api/users/profile
Authorization: Bearer <access_token>
```

#### Update Profile
```http
PUT /api/users/profile
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith"
}
```

#### Change Password
```http
PUT /api/users/password
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "currentPassword": "OldPass123",
  "newPassword": "NewPass123"
}
```

### Applications

#### List Applications
```http
GET /api/applications?page=1&limit=10&status=APPLIED&search=Google
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Filter by status (WISHLIST, APPLIED, INTERVIEW, OFFER, REJECTED)
- `search`: Search company or role

**Response:**
```json
{
  "success": true,
  "data": {
    "applications": [...],
    "pagination": {
      "total": 50,
      "pages": 5,
      "page": 1,
      "limit": 10
    }
  }
}
```

#### Create Application
```http
POST /api/applications
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "company": "Google",
  "role": "Software Engineer",
  "status": "APPLIED",
  "salary": 2400000,
  "location": "Bangalore",
  "jobUrl": "https://careers.google.com/jobs/123",
  "notes": "Applied via referral"
}
```

#### Get Application Stats
```http
GET /api/applications/stats
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 50,
    "byStatus": {
      "WISHLIST": 10,
      "APPLIED": 20,
      "INTERVIEW": 15,
      "OFFER": 3,
      "REJECTED": 2
    }
  }
}
```

#### Update Application
```http
PUT /api/applications/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "status": "INTERVIEW",
  "notes": "Phone screening scheduled"
}
```

#### Delete Application
```http
DELETE /api/applications/:id
Authorization: Bearer <access_token>
```

## 🔒 Security Features

### Password Security
- bcrypt hashing with 10 salt rounds
- Password strength requirements
- Secure password change flow

### JWT Authentication
- Access tokens (15min expiry)
- Refresh tokens (7 days expiry)
- HTTP-only cookies for refresh tokens
- Token rotation on refresh

### Input Validation
- Zod schemas for all inputs
- Email format validation
- Password complexity rules
- SQL injection prevention (Prisma)

### CORS Configuration
```typescript
app.use(cors({
    origin: ['https://jobsync-lime.vercel.app', 'http://localhost:3000'],
    credentials: true
}));
```

## 🗄️ Database Schema

```prisma
model User {
  id            String   @id @default(uuid())
  email         String   @unique
  password      String
  firstName     String
  lastName      String
  applications  Application[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Application {
  id          String   @id @default(uuid())
  userId      String
  company     String
  role        String
  status      ApplicationStatus @default(WISHLIST)
  salary      Int?
  location    String?
  jobUrl      String?
  notes       String?
  appliedAt   DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

enum ApplicationStatus {
  WISHLIST
  APPLIED
  INTERVIEW
  OFFER
  REJECTED
}
```

## 🚢 Deployment

### Render (Recommended)

1. Create PostgreSQL database on Render
2. Create Web Service, connect GitHub repo
3. Set Root Directory: `backend`
4. Set Build Command:
   ```bash
   npm install && npm run build && npx prisma generate && npx prisma db push
   ```
5. Set Start Command: `npm start`
6. Add environment variables:
   - `DATABASE_URL` (from Render PostgreSQL)
   - `JWT_ACCESS_SECRET`
   - `JWT_REFRESH_SECRET`
   - `NODE_ENV=production`
   - `FRONTEND_URL=https://jobsync-lime.vercel.app`

## 🔧 Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Compile TypeScript to JavaScript
npm run start        # Start production server
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run migrations (for production)
npm run db:studio    # Open Prisma Studio
```

## 📦 Dependencies

### Core
- express@^4.21.2
- typescript@^5.7.3
- @prisma/client@^6.2.1

### Security
- jsonwebtoken@^9.0.2
- bcryptjs@^2.4.3
- cors@^2.8.5
- cookie-parser@^1.4.7

### Validation
- zod@^3.24.1

### DevOps
- tsx@^4.19.2 (development)
- prisma@^6.2.1 (devDependency)

## 🐛 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message"
}
```

**HTTP Status Codes:**
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (invalid/missing token)
- `404`: Not Found
- `500`: Internal Server Error

## 📊 Health Check

```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-06T16:30:00.000Z"
}
```

## 📄 License

Part of JobSync Full-Stack Assignment for Judix

## 🔗 Related

- **Frontend Repository**: `frontend/`
- **Postman Collection**: `../postman_collection.json`
- **Main README**: `../README.md`
