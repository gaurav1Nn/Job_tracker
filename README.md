# JobSync - Full-Stack Job Application Tracker

<div align="center">

![JobSync](https://img.shields.io/badge/JobSync-Live-success)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![Node.js](https://img.shields.io/badge/Node.js-24.x-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)

**A modern, scalable full-stack web application for tracking job applications**

[Live Demo](https://jobsync-lime.vercel.app) · [API Documentation](postman_collection.json) 

</div>

---

## 📋 Assignment Submission for Full-Stack Developer Intern Role

**Submitted by:** Gaurav  
**Repository:** [github.com/gaurav1Nn/JOB_trackor](https://github.com/gaurav1Nn/JOB_trackor)  
**Completion Time:** 3 Days

---

## 🌐 Live Deployment

| Service | URL | Status |
|---------|-----|--------|
| **Frontend** | [jobsync-lime.vercel.app](https://jobsync-lime.vercel.app) | 🟢 Live |
| **Backend API** | [jobsync-backend-nvya.onrender.com](https://jobsync-backend-nvya.onrender.com/api/health) | 🟢 Live |
| **Database** | PostgreSQL (Render) | 🟢 Live |

---

## ✅ Core Features Implemented

### Frontend (Next.js 14 + TypeScript)
- ✅ **Modern UI Framework**: Built with Next.js 14 (App Router)
- ✅ **Responsive Design**: TailwindCSS with dark mode support
- ✅ **Form Validation**: Client-side (Zod) + Server-side validation
- ✅ **Protected Routes**: Authentication middleware for dashboard access
- ✅ **State Management**: React Query for server state, Context API for auth
- ✅ **Premium UI/UX**: Animated components, glassmorphism, micro-interactions

### Backend (Node.js + Express + TypeScript)
- ✅ **RESTful API**: Clean, modular Express.js architecture
- ✅ **Authentication**: JWT-based (access + refresh tokens)
- ✅ **Database**: PostgreSQL with Prisma ORM
- ✅ **CRUD Operations**: Full application management (Create, Read, Update, Delete)
- ✅ **Security**: Password hashing (bcrypt), JWT middleware, input validation
- ✅ **Error Handling**: Centralized error middleware with proper HTTP codes

### Dashboard Features
- ✅ **User Profile**: Fetch and update user information
- ✅ **Application CRUD**: Manage job applications with full CRUD
- ✅ **Search & Filter**: Real-time search by company/role, filter by status
- ✅ **Pagination**: Efficient data loading with page controls
- ✅ **Statistics**: Visual dashboard with success rates and application counts
- ✅ **Logout Flow**: Secure token invalidation

### Security & Scalability
- ✅ **Password Hashing**: bcryptjs with salt rounds
- ✅ **JWT Authentication**: Secure token-based auth with refresh mechanism
- ✅ **CORS Configuration**: Production-ready CORS policy
- ✅ **Environment Variables**: Secure configuration management
- ✅ **Input Validation**: Zod schemas on both client and server
- ✅ **Error Handling**: Comprehensive error responses
- ✅ **Modular Architecture**: Separation of concerns (routes, controllers, middleware)

---

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: TailwindCSS 4
- **State Management**: React Query (TanStack Query)
- **Form Validation**: Zod
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: Node.js 24.x
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma 6
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: Zod
- **CORS**: cors middleware

### DevOps & Deployment
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Render
- **Database Hosting**: Render PostgreSQL
- **Version Control**: Git + GitHub
- **CI/CD**: Auto-deploy on push (Vercel + Render)

---

## 📁 Project Structure

```
JOB_trackor/
├── frontend/                 # Next.js Frontend
│   ├── src/
│   │   ├── app/             # Next.js 14 App Router
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # React Context (Auth, Theme)
│   │   ├── lib/             # Utilities, API client, validation
│   │   └── types/           # TypeScript type definitions
│   ├── public/              # Static assets
│   └── package.json
│
├── backend/                  # Express.js Backend
│   ├── src/
│   │   ├── routes/          # API route handlers
│   │   ├── controllers/     # Business logic
│   │   ├── middleware/      # Auth, error handling, validation
│   │   ├── config/          # Database, environment config
│   │   └── index.ts         # Server entry point
│   ├── prisma/              # Database schema & migrations
│   └── package.json
│
├── postman_collection.json   # API Testing Collection
└── README.md                 # This file
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+
- Git

### 1. Clone Repository
```bash
git clone https://github.com/gaurav1Nn/JOB_trackor.git
cd JOB_trackor
```

### 2. Backend Setup
```bash
cd backend
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Setup database
npx prisma generate
npx prisma db push

# Start server
npm run dev
```

Backend runs on `http://localhost:5000`

### 3. Frontend Setup
```bash
cd frontend
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with backend URL

# Start dev server
npm run dev
```

Frontend runs on `http://localhost:3000`

---

## 📚 API Documentation

### Authentication Endpoints

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

### User Endpoints

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

### Application Endpoints

#### List Applications
```http
GET /api/applications?page=1&limit=10&status=APPLIED&search=Google
Authorization: Bearer <access_token>
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
  "notes": "Referred by John"
}
```

#### Update Application
```http
PUT /api/applications/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "status": "INTERVIEW"
}
```

#### Delete Application
```http
DELETE /api/applications/:id
Authorization: Bearer <access_token>
```

**📝 Full Postman Collection**: [postman_collection.json](postman_collection.json)

---

## 🔒 Security Features

1. **Password Security**
   - bcrypt hashing with 10 salt rounds
   - Minimum password requirements enforced

2. **JWT Authentication**
   - Access tokens (15min expiry)
   - Refresh tokens (7 days expiry)
   - HTTP-only cookies for refresh tokens

3. **Input Validation**
   - Zod schemas for type-safe validation
   - Server-side validation on all endpoints
   - XSS prevention through input sanitization

4. **CORS Policy**
   - Configured allowed origins
   - Credentials support for cookies
   - Production-ready settings

5. **Error Handling**
   - No sensitive data in error responses
   - Proper HTTP status codes
   - Logged errors for monitoring

---

## 📈 Scalability Architecture

### Current Implementation
- **Modular Code Structure**: Separated concerns (routes, controllers, middleware)
- **Database Indexing**: Optimized queries with Prisma
- **Stateless Backend**: JWT tokens enable horizontal scaling
- **CDN-Ready Frontend**: Static assets on Vercel Edge Network

### Production Scaling Strategy

#### Frontend Scaling
1. **Performance**
   - Next.js ISR (Incremental Static Regeneration)
   - Image optimization with Next.js Image component
   - Code splitting and lazy loading
   - Redis caching for API responses

2. **Infrastructure**
   - CDN distribution (Vercel Edge)
   - Multiple region deployment
   - Auto-scaling based on traffic

#### Backend Scaling
1. **Horizontal Scaling**
   - Stateless architecture (no server-side sessions)
   - Load balancer (Nginx/AWS ALB)
   - Multiple backend instances

2. **Database Optimization**
   - Connection pooling (PgBouncer)
   - Read replicas for queries
   - Database sharding for large datasets
   - Caching layer (Redis)

3. **Advanced Features**
   - Message queue for async jobs (Bull/RabbitMQ)
   - Microservices architecture for complex features
   - API rate limiting
   - Monitoring & logging (DataDog, Sentry)

#### DevOps
- **CI/CD**: GitHub Actions for automated testing and deployment
- **Containerization**: Docker for consistent environments
- **Orchestration**: Kubernetes for container management
- **Monitoring**: APM tools, error tracking, performance metrics

---

## 🧪 Testing

### Manual Testing
- ✅ Authentication flows (signup, login, logout, refresh)
- ✅ Protected routes (redirect to login)
- ✅ CRUD operations on applications
- ✅ Search and filter functionality
- ✅ Form validations (client + server)
- ✅ Error handling (network errors, validation errors)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark mode consistency

### API Testing
- Postman collection with all endpoints
- Environment variables for dev/prod
- Test cases for success and error scenarios

---

## 🎨 UI/UX Highlights

- **Premium Design**: Modern glassmorphism, gradients, and animations
- **Dark Mode**: Enforced dark theme for professional aesthetic
- **Responsive**: Mobile-first design, works on all devices
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation
- **Micro-interactions**: Smooth transitions, hover effects, loading states
- **User Feedback**: Toast notifications, error messages, success states

---

## 📦 Deliverables Checklist

- ✅ Frontend (Next.js) + Backend (Node.js) in GitHub repo
- ✅ Functional authentication (JWT-based register/login/logout)
- ✅ Dashboard with CRUD-enabled entity (job applications)
- ✅ Postman collection for API testing
- ✅ Comprehensive documentation (this README)
- ✅ Scalability documentation (see above)
- ✅ Live deployed application (Vercel + Render)
- ✅ Security best practices implemented
- ✅ Clean, maintainable code structure

---

## 👨‍💻 Developer

**Gaurav**  
📧 Email: nilawargaurav@gmail.com
💼 GitHub: [@gaurav1Nn](https://github.com/gaurav1Nn)

---

## 📄 License

This project is part of an assignment submission for the Full-Stack Developer Intern role at Judix.

---

## 🙏 Acknowledgments

- Assignment provided by **Judix** (shivam@judix.in)
- Built with modern web technologies and best practices
- Deployed using industry-standard platforms (Vercel, Render)

---

<div align="center">

**⭐ If you find this project impressive, please star the repository!**

Made with ❤️ for the Judix Full-Stack Developer Intern Assignment

</div>
