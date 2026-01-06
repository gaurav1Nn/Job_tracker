# JobSync Frontend

Modern Next.js 14 application for the JobSync job application tracker.

## 🌐 Live Demo

**Production:** [https://jobsync-lime.vercel.app](https://jobsync-lime.vercel.app)

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (React 19)
- **Language:** TypeScript 5
- **Styling:** TailwindCSS 4
- **State Management:** React Query (TanStack Query)
- **Form Validation:** Zod
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Notifications:** React Hot Toast

## 📋 Features

- ✅ **Authentication**: JWT-based auth with auto-refresh
- ✅ **Protected Routes**: Middleware-based route protection
- ✅ **Dashboard**: Stats, charts, and recent activity
- ✅ **Application Management**: Full CRUD with search and filters
- ✅ **User Profile**: Update profile and change password
- ✅ **Responsive Design**: Mobile-first, dark mode
- ✅ **Premium UI**: Glassmorphism, animations, micro-interactions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
```

### Environment Variables

Create `.env.local` with:

```env
NEXT_PUBLIC_API_URL=https://jobsync-backend-nvya.onrender.com/api
```

For local development:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm run start
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                 # Next.js 14 App Router
│   │   ├── (auth)/         # Auth pages (login, signup)
│   │   ├── (dashboard)/    # Protected dashboard pages
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Landing page
│   ├── components/
│   │   ├── ui/             # Reusable UI components
│   │   ├── forms/          # Form components
│   │   └── dashboard/      # Dashboard-specific components
│   ├── context/
│   │   ├── AuthContext.tsx # Authentication state
│   │   ├── ThemeContext.tsx# Theme management
│   │   └── Providers.tsx   # Global providers
│   ├── lib/
│   │   ├── api.ts          # Axios instance & interceptors
│   │   ├── utils.ts        # Helper functions
│   │   └── validations.ts  # Zod schemas
│   └── types/              # TypeScript types
├── public/                  # Static assets
└── package.json
```

## 🎨 Key Components

### Authentication
- `AuthContext`: Global auth state management
- Protected routes via middleware
- Auto token refresh on 401 errors

### UI Components
- `Button`, `Input`, `Select`, `Textarea`: Form components
- `Card`, `Modal`: Layout components
- `ApplicationCard`: Job application display
- `Sidebar`, `Header`: Navigation components

### Validation
All forms use Zod schemas for type-safe validation:
- Login/Signup validation
- Profile update validation
- Application form validation

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variable:
   - `NEXT_PUBLIC_API_URL` = `https://jobsync-backend-nvya.onrender.com/api`
4. Set Root Directory to `frontend`
5. Deploy!

### Manual Deploy

```bash
npm run build
# Deploy .next folder to your hosting
```

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🎨 Design Features

- **Dark Mode**: Enforced for premium aesthetic
- **Glassmorphism**: Frosted glass effects
- **Animations**: Smooth transitions and micro-interactions
- **Typography**: Professional font stack (Geist Sans)
- **Color Scheme**: Indigo/Purple gradients

## 🔧 Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
```

## 📦 Dependencies

### Core
- next@16.1.1
- react@19.2.3
- typescript@^5

### Utilities
- @tanstack/react-query@^5.90.16
- axios@^1.13.2
- zod@^4.3.5
- clsx@^2.1.1
- tailwind-merge@^3.4.0

### UI
- lucide-react@^0.562.0
- react-hot-toast@^2.6.0

## 🐛 Known Issues

- First load after deployment may be slow on Render free tier (cold start)

## 📄 License

Part of JobSync Full-Stack Assignment for Judix
