<div align="center">

# 🔄 SkillExchange

### Connect & Learn - Share Your Skills, Learn New Ones

A modern full-stack platform for exchanging skills with people around you. Share what you know, learn what you want!

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/) [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/) [![Prisma](https://img.shields.io/badge/Prisma-6.0-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/) [![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

[Live Demo](#) • [Documentation](#) • [Report Bug](#) • [Request Feature](#)

</div>

---

## 📖 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🎯 About

**SkillExchange** is a community-driven platform that connects people who want to share their skills with those who want to learn. Whether you're a developer wanting to learn design, or a chef wanting to learn coding, SkillExchange makes it easy to find the perfect skill exchange partner.

### Why SkillExchange?

- 💰 **100% Free** - No subscriptions, no hidden costs
- 🤝 **Smart Matching** - AI-powered matching algorithm finds your perfect learning partner
- 📍 **Location-Based** - Connect with people nearby or online
- ✅ **Trust & Safety** - Verified profiles, vouching system, and community moderation
- 🌟 **Beautiful UI** - Modern, responsive design that works on all devices

---

## ✨ Features

### 🔐 Authentication & Profiles
- ✅ Secure email/password authentication with JWT
- ✅ NextAuth.js integration for social login (Google, GitHub)
- ✅ Comprehensive user profiles with rich information
- ✅ Profile completion tracking
- ✅ Social media integration (LinkedIn, Twitter, GitHub)

### 🎯 Skills Management
- ✅ Browse 8+ skill categories (Technology, Design, Business, etc.)
- ✅ Add skills you can teach (with proficiency levels)
- ✅ Add skills you want to learn
- ✅ Skill endorsements and vouching system
- ✅ Auto-suggest skills based on category

### 🤝 Smart Matching
- ✅ AI-powered skill matching algorithm
- ✅ Perfect swap detection (you teach what they want, they teach what you want)
- ✅ One-way matches (teacher/learner only)
- ✅ Match score calculation
- ✅ Filter matches by skill, location, and availability

### 💬 Connections & Messaging
- ✅ Send connection requests with personalized messages
- ✅ Accept/reject connection requests
- ✅ Real-time messaging system
- ✅ Conversation history
- ✅ Unread message notifications

### 📱 Social Feed
- ✅ Share posts, tips, and skill showcases
- ✅ Like and comment on posts
- ✅ Filter by post type (Text, Skill Showcase, Tips, Events)
- ✅ Privacy controls (Public, Connections Only, Private)
- ✅ Responsive 3-column layout

### ⭐ Trust & Safety
- ✅ Vouch for users' skills
- ✅ Rating system (1-5 stars)
- ✅ Report inappropriate content
- ✅ Verified user badges
- ✅ Community moderation

### 📍 Location Features (Coming Soon)
- 🔜 Location-based radius search (5km, 10km, 25km)
- 🔜 Map view of nearby users
- 🔜 In-person vs online meeting preferences
- 🔜 Preferred meeting locations

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Custom components with Radix UI primitives
- **Authentication:** NextAuth.js
- **State Management:** React Hooks
- **HTTP Client:** Axios
- **Forms:** React Hook Form

### Backend
- **Runtime:** Node.js 20+
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL 15
- **ORM:** Prisma 6
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Validation:** Custom middleware
- **CORS:** cors

### Database
- **Primary Database:** PostgreSQL
- **Schema Management:** Prisma Migrate
- **Database GUI:** Prisma Studio

### DevOps & Tools
- **Version Control:** Git & GitHub
- **Package Manager:** npm
- **Development:** nodemon, ts-node
- **Code Quality:** ESLint, Prettier
- **Environment:** dotenv

---

## 📁 Project Structure

```
skill-exchange-platform/
│
├── frontend/ # Next.js Frontend
│ ├── app/ # App Router pages
│ │ ├── (auth)/ # Authentication pages
│ │ │ ├── login/
│ │ │ └── register/
│ │ ├── (dashboard)/ # Protected dashboard pages
│ │ │ ├── dashboard/
│ │ │ ├── feed/
│ │ │ ├── matches/
│ │ │ ├── connections/
│ │ │ ├── messages/
│ │ │ ├── skills/
│ │ │ ├── profile/
│ │ │ └── users/[id]/
│ │ ├── api/ # API routes (NextAuth)
│ │ └── layout.tsx
│ ├── components/ # Reusable components
│ │ ├── layout/
│ │ ├── ui/
│ │ └── ...
│ ├── hooks/ # Custom React hooks
│ ├── lib/ # Utilities & configurations
│ ├── types/ # TypeScript type definitions
│ ├── public/ # Static assets
│ └── package.json
│
├── backend/ # Express.js Backend
│ ├── src/
│ │ ├── controllers/ # Request handlers
│ │ │ ├── authController.ts
│ │ │ ├── userController.ts
│ │ │ ├── skillController.ts
│ │ │ ├── matchController.ts
│ │ │ ├── connectionController.ts
│ │ │ ├── messageController.ts
│ │ │ ├── postController.ts
│ │ │ └── vouchController.ts
│ │ ├── routes/ # API routes
│ │ ├── middleware/ # Auth & validation
│ │ ├── types/ # TypeScript types
│ │ └── index.ts # Server entry point
│ ├── prisma/
│ │ ├── schema.prisma # Database schema
│ │ ├── migrations/ # Database migrations
│ │ └── seed.ts # Seed data
│ └── package.json
│
├── .gitignore
├── README.md
└── LICENSE
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20.x or higher ([Download](https://nodejs.org/))
- **PostgreSQL** 15.x or higher ([Download](https://www.postgresql.org/download/))
- **npm** 10.x or higher (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))

### Installation

1️⃣ **Clone the repository**

```bash
git clone https://github.com/yourusername/skill-exchange-platform.git
cd skill-exchange-platform
```

2️⃣ **Install Frontend Dependencies**

```bash
cd frontend
npm install
```

3️⃣ **Install Backend Dependencies**

```bash
cd ../backend
npm install
```

---

## 🔐 Environment Variables

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```
# Server Configuration
NODE_ENV=development
PORT=5000

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/skillexchange

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# Optional
LOG_LEVEL=debug
```

### Frontend Environment Variables

Create a `.env.local` file in the `frontend` directory:

```
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-minimum-32-characters

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Optional: Social Auth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

**Generate Secrets:**

Generate JWT_SECRET
```bash
openssl rand -base64 32
```

Or using Node.js
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 💾 Database Setup

### 1. Create PostgreSQL Database

Login to PostgreSQL
```sql
psql -U postgres
```

Create database
```sql
CREATE DATABASE skillexchange;
```

Exit
```sql
\q
```

### 2. Run Prisma Migrations

```bash
cd backend
```

Generate Prisma Client
```bash
npx prisma generate
```

Push schema to database
```bash
npx prisma db push
```

Or run migrations
```bash
npx prisma migrate dev --name init
```

### 3. Seed the Database

Seed categories and sample data
```bash
npm run seed
```

### 4. Verify Database (Optional)

Open Prisma Studio to view data
```bash
npx prisma studio
```

This will open a browser at `http://localhost:5555` where you can view and edit your database.

---

## ▶️ Running the Application

### Development Mode

**Terminal 1 - Backend Server:**
```bash
cd backend
npm run dev
```
Server runs on http://localhost:5000

**Terminal 2 - Frontend Server:**
```bash
cd frontend
npm run dev
```
App runs on http://localhost:3000

### Production Build

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm start
```

### Test Credentials

After seeding, you can login with:
- **Email:** `test@example.com`
- **Password:** `password123`

---

## 📚 API Documentation

### Base URL
http://localhost:5000/api

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |

**Example Register Request:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
-H "Content-Type: application/json" \
-d '{
"email": "user@example.com",
"password": "password123",
"firstName": "John",
"lastName": "Doe",
"location": "Mumbai, India"
}'
```

### User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users/profile` | Get current user profile | Yes |
| PUT | `/users/profile` | Update profile | Yes |
| GET | `/users/:id` | Get user by ID | Yes |
| GET | `/users` | Search users | Yes |

### Skills Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/skills` | Get all skills | Yes |
| GET | `/skills/categories` | Get categories | Yes |
| GET | `/skills/category/:id` | Get skills by category | Yes |
| GET | `/skills/user` | Get user's skills | Yes |
| POST | `/skills/user` | Add skill to user | Yes |
| PUT | `/skills/user/:id` | Update user skill | Yes |
| DELETE | `/skills/user/:id` | Delete user skill | Yes |

### Matches Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/matches` | Get skill matches | Yes |

### Connections Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/connections` | Get connections | Yes |
| POST | `/connections/send` | Send connection request | Yes |
| PUT | `/connections/:id/accept` | Accept request | Yes |
| PUT | `/connections/:id/reject` | Reject request | Yes |

### Messages Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/messages` | Get conversations | Yes |
| GET | `/messages/:userId` | Get messages with user | Yes |
| POST | `/messages/send` | Send message | Yes |
| PUT | `/messages/:id/read` | Mark as read | Yes |

### Posts Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/posts` | Get feed posts | Yes |
| POST | `/posts` | Create post | Yes |
| PUT | `/posts/:id` | Update post | Yes |
| DELETE | `/posts/:id` | Delete post | Yes |
| POST | `/posts/:id/like` | Like post | Yes |
| POST | `/posts/:id/comment` | Comment on post | Yes |

**Authentication Header:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 📸 Screenshots

### Login & Registration
![Login Page](docs/screenshots/login.png)
*Modern authentication with social login options*

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)
*Clean, intuitive dashboard with quick stats*

### Profile Page
![Profile](docs/screenshots/profile.png)
*Rich user profiles with skills, vouches, and social links*

### Skills Management
![Skills](docs/screenshots/skills.png)
*Easy skill management with categories*

### Smart Matching
![Matches](docs/screenshots/matches.png)
*AI-powered matching with skill compatibility scores*

### Feed
![Feed](docs/screenshots/feed.png)
*Engaging social feed with posts, tips, and showcases*

---

## 🗺️ Roadmap

### Phase 1: MVP ✅ (Current)
- [x] User authentication & profiles
- [x] Skills management
- [x] Basic matching algorithm
- [x] Connections & messaging
- [x] Social feed
- [x] Vouching system

### Phase 2: Enhanced Features 🚧 (In Progress)
- [ ] Location-based radius search
- [ ] Map view of nearby users
- [ ] Advanced search filters
- [ ] Notification system
- [ ] Email notifications
- [ ] Mobile responsive improvements

### Phase 3: Community Features 🔮 (Planned)
- [ ] Skill verification badges
- [ ] Community events
- [ ] Group skill sessions
- [ ] Skill challenges
- [ ] Achievement system
- [ ] Leaderboards

### Phase 4: AI & Analytics 🔮 (Future)
- [ ] AI-powered skill recommendations
- [ ] Learning path suggestions
- [ ] Analytics dashboard
- [ ] Success metrics tracking
- [ ] Skill progress tracking
- [ ] Smart scheduling

### Phase 5: Mobile App 🔮 (Future)
- [ ] React Native mobile app
- [ ] Push notifications
- [ ] Offline mode
- [ ] Camera integration for profiles
- [ ] Voice/video calls

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**!

### How to Contribute

1. **Fork the Project**
2. **Create your Feature Branch**
```bash
git checkout -b feature/AmazingFeature
```
3. **Commit your Changes**
```bash
git commit -m 'Add some AmazingFeature'
```
4. **Push to the Branch**
```bash
git push origin feature/AmazingFeature
```
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features
- Test thoroughly before submitting PR
- Keep PRs focused and atomic

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

```
MIT License

Copyright (c) 2025 SkillExchange

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 📧 Contact

**Project Maintainer:** Your Name

- Email: your.email@example.com
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Twitter: [@yourhandle](https://twitter.com/yourhandle)
- GitHub: [@yourusername](https://github.com/yourusername)

**Project Link:** [https://github.com/yourusername/skill-exchange-platform](https://github.com/yourusername/skill-exchange-platform)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [NextAuth.js](https://next-auth.js.org/) - Authentication for Next.js
- [PostgreSQL](https://www.postgresql.org/) - Advanced open source database
- [Vercel](https://vercel.com/) - Deployment platform
- All our amazing contributors!

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by the SkillExchange Team

[Back to Top](#-skillexchange)

</div>
