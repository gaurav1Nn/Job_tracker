# Job Application Tracker

A full-stack web application for tracking job applications with authentication, CRUD operations, filtering, and a modern UI.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Express.js](https://img.shields.io/badge/Express.js-4-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## Features

### Authentication
- ✅ User registration with password validation
- ✅ Login with JWT access + refresh tokens
- ✅ Secure password hashing (bcrypt)
- ✅ Token rotation on refresh
- ✅ Protected routes

### Dashboard
- ✅ Overview with statistics cards
- ✅ Recent applications list
- ✅ Dark/Light mode toggle
- ✅ Responsive sidebar navigation

### Applications CRUD
- ✅ Create, Read, Update, Delete operations
- ✅ 7 status types (Wishlist → Applied → Interview → Offer/Rejected)
- ✅ Search by company, role, notes
- ✅ Filter by status
- ✅ Pagination
- ✅ Salary and location tracking

### Profile
- ✅ View and update profile info
- ✅ Change password with validation

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, TypeScript, TailwindCSS |
| Backend | Express.js, TypeScript |
| Database | PostgreSQL, Prisma ORM |
| Auth | JWT, bcrypt |
| Validation | Zod |
| State | React Query |

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database URL and secrets

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Start development server
npm run dev
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
# Create .env.local with:
# NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Start development server
npm run dev
```

### Environment Variables

**Backend (.env)**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/job_tracker"
JWT_ACCESS_SECRET="your-access-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
ACCESS_TOKEN_EXPIRY="15m"
REFRESH_TOKEN_EXPIRY="7d"
PORT=5000
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
```

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/signup | Register |
| POST | /api/auth/login | Login |
| POST | /api/auth/refresh | Refresh token |
| POST | /api/auth/logout | Logout |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/users/profile | Get profile |
| PUT | /api/users/profile | Update profile |
| PUT | /api/users/password | Change password |

### Applications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/applications | List (with filters) |
| GET | /api/applications/:id | Get one |
| POST | /api/applications | Create |
| PUT | /api/applications/:id | Update |
| DELETE | /api/applications/:id | Delete |
| GET | /api/applications/stats | Get statistics |

## Project Structure

```
jUDIX/
├── backend/
│   ├── src/
│   │   ├── config/        # Environment & database config
│   │   ├── controllers/   # Request handlers
│   │   ├── middleware/    # Auth, validation, error handling
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── validations/   # Zod schemas
│   └── prisma/            # Database schema
│
├── frontend/
│   ├── src/
│   │   ├── app/           # Next.js pages
│   │   ├── components/    # React components
│   │   ├── context/       # Auth & Theme providers
│   │   ├── lib/           # Utilities & API client
│   │   └── types/         # TypeScript types
│   └── public/
│
└── README.md
```

## Scalability Considerations

### Current Architecture
- Modular code structure with separation of concerns
- TypeScript for type safety
- Prisma ORM for database abstraction
- JWT with refresh token rotation

### Production Recommendations
1. **Caching**: Add Redis for session/API caching
2. **Rate Limiting**: Implement per-endpoint rate limits
3. **Database**: Connection pooling, read replicas
4. **CDN**: Static assets via CDN
5. **Monitoring**: Add APM (DataDog, New Relic)
6. **CI/CD**: GitHub Actions for automated testing/deployment
7. **Containerization**: Docker for consistent environments

## License

MIT
