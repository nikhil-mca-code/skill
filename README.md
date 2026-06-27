# 🚀 SkillBridge

<div align="center">

### Production-Ready Full-Stack Marketplace SaaS

*A modern service marketplace that connects customers with skilled professionals through a secure, scalable, and responsive web platform.*

<p>

<a href="https://skill-bridge-riya.vercel.app">
<img src="https://img.shields.io/badge/🌐_Live_Demo-Visit-success?style=for-the-badge" />
</a>

<a href="https://github.com/nikhil-mca-code/skill">
<img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github" />
</a>

</p>

<p>

<img src="https://img.shields.io/badge/Next.js-14-black?logo=next.js" />
<img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white" />
<img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white" />
<img src="https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma" />
<img src="https://img.shields.io/badge/PostgreSQL-Neon-336791?logo=postgresql" />
<img src="https://img.shields.io/badge/NextAuth-Authentication-000000" />
<img src="https://img.shields.io/badge/Cloudinary-Media-3448C5?logo=cloudinary" />

</p>

</div>

---

# 📖 About

SkillBridge is a modern marketplace platform inspired by services such as **Upwork**, **Fiverr**, and **Urban Company**. It enables customers to discover skilled professionals, book services, and manage appointments through a secure and user-friendly interface.

Professionals can create public profiles, showcase their expertise, upload profile images, publish services, and manage bookings from a dedicated dashboard. Administrators have tools to manage marketplace categories and maintain platform content.

The project was developed to demonstrate production-level full-stack development using the latest web technologies and best practices, including secure authentication, cloud storage integration, role-based authorization, and scalable architecture.

---

# ✨ Key Features

### 🔐 Authentication

- Google OAuth Login
- Email & Password Authentication
- Secure Password Hashing (bcrypt)
- JWT Session Management
- Protected Routes
- Role-Based Authorization

### 👤 Customer

- Browse Professionals
- Explore Service Categories
- View Service Details
- Book Services
- Manage Bookings

### 💼 Professional

- Professional Onboarding
- Public Profile Creation
- Cloudinary Image Upload
- Create & Manage Services
- Booking Dashboard

### 🛠️ Admin

- Category Management
- Marketplace Administration
- Role-Based Dashboard

---

# 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Frontend | React 18 |
| Styling | Tailwind CSS |
| Backend | Next.js API Routes |
| Database | Neon PostgreSQL |
| ORM | Prisma |
| Authentication | NextAuth.js |
| Image Storage | Cloudinary |
| Forms | React Hook Form |
| Validation | Zod |
| Data Fetching | TanStack Query |
| Deployment | Vercel |

---

# 🌟 Highlights

- 🚀 Production-Ready Architecture
- 🔒 Secure Authentication System
- 📱 Fully Responsive UI
- ☁️ Cloud-Based Media Uploads
- 👥 Multi-Role Dashboard
- 📂 Clean & Scalable Codebase
- ⚡ Optimized Performance
- 🌍 Live Deployment on Vercel

---

# 🎯 Project Goals

- Build a scalable full-stack SaaS application.
- Demonstrate modern React and Next.js development.
- Showcase secure authentication and authorization.
- Implement real-world database design using Prisma.
- Integrate third-party cloud services.
- Create a portfolio-quality project suitable for internships and software engineering roles.

---
# 📂 Project Structure

```text
skill/
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
│
├── public/
│
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── (dashboard)/
│   │   ├── (public)/
│   │   ├── api/
│   │   ├── auth/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── providers.tsx
│   │
│   ├── components/
│   ├── config/
│   ├── hooks/
│   ├── lib/
│   ├── types/
│   └── middleware.ts
│
├── .env.example
├── next.config.js
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

Before running the project locally, ensure you have:

- Node.js 20+
- npm
- Git
- PostgreSQL (Neon recommended)
- Cloudinary Account
- Google Cloud Console Project

---

## 📥 Installation

Clone the repository

```bash
git clone https://github.com/nikhil-mca-code/skill.git
```

Move into the project directory

```bash
cd skill
```

Install dependencies

```bash
npm install
```

---

# ⚙️ Environment Variables

Create a `.env.local` file in the project root.

```env
DATABASE_URL=

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_UPLOAD_PRESET=

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
```

> A sample configuration is available in `.env.example`.

---

# 🗄️ Database Setup

Generate Prisma Client

```bash
npx prisma generate
```

Push the database schema

```bash
npx prisma db push
```

(Optional) Seed the database

```bash
npm run seed
```

Open Prisma Studio

```bash
npx prisma studio
```

---

# ▶️ Running the Project

Start the development server

```bash
npm run dev
```

Create a production build

```bash
npm run build
```

Start the production server

```bash
npm start
```

Open your browser and visit:

```
http://localhost:3000
```

---

# ☁️ Deployment

The project is deployed using modern cloud services.

| Service | Platform |
|---------|----------|
| Frontend | Vercel |
| Backend | Next.js API Routes |
| Database | Neon PostgreSQL |
| Authentication | NextAuth.js |
| Media Storage | Cloudinary |

Deployment Steps:

1. Push the repository to GitHub.
2. Import the project into Vercel.
3. Configure environment variables.
4. Deploy the application.
5. Update Google OAuth redirect URIs.
6. Verify authentication, uploads, and database connectivity.

---

# 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx prisma generate` | Generate Prisma Client |
| `npx prisma db push` | Sync database schema |
| `npx prisma studio` | Open Prisma Studio |

---

# 📸 Screenshots

> Replace the placeholders below with screenshots of your application after deployment.

| Home Page | Sign In |
|-----------|---------|
| *(Screenshot)* | *(Screenshot)* |

| Customer Dashboard | Professional Dashboard |
|--------------------|------------------------|
| *(Screenshot)* | *(Screenshot)* |

| Services | Professional Profile |
|----------|----------------------|
| *(Screenshot)* | *(Screenshot)* |

---
# 🚀 Future Roadmap

The following features are planned for future releases:

- 💳 Razorpay Payment Integration
- ⭐ Ratings & Reviews
- 💬 Real-Time Chat
- 🔔 Email & Push Notifications
- 📅 Booking Calendar
- 📊 Admin Analytics Dashboard
- ❤️ Wishlist & Favorites
- 🔍 Advanced Search & Filters
- 🌙 Dark Mode
- 📱 Progressive Web App (PWA)

---

# 🤝 Contributing

Contributions, suggestions, and bug reports are welcome.

1. Fork the repository.
2. Create a new feature branch.
3. Commit your changes.
4. Push the branch.
5. Open a Pull Request.

---

# 📄 License

This project is licensed under the **MIT License**.

See the `LICENSE` file for more information.

---

# 👨‍💻 Developer

## Nikhil Singh

**Full Stack Developer | MCA Aspirant**

I enjoy building scalable, production-ready web applications using modern technologies. SkillBridge reflects my interest in creating real-world SaaS products with secure authentication, clean architecture, and an excellent user experience.

### 🌐 Connect With Me

**Portfolio**

https://nikhil-in.netlify.app

**LinkedIn**

https://www.linkedin.com/in/nikhil-mca-in

**GitHub**

https://github.com/nikhil-mca-code

---

# 💡 What I Learned

Developing SkillBridge helped strengthen my understanding of:

- Full-Stack Application Development
- Next.js App Router
- TypeScript
- Prisma ORM
- PostgreSQL Database Design
- Authentication with NextAuth
- Cloudinary Integration
- Role-Based Authorization
- REST API Development
- Production Deployment on Vercel

---

# 🙌 Acknowledgements

This project was built using amazing open-source technologies:

- Next.js
- React
- TypeScript
- Prisma
- PostgreSQL
- NextAuth.js
- Tailwind CSS
- Cloudinary
- Vercel

A huge thanks to the open-source community for providing excellent tools and documentation.

---

<div align="center">

## ⭐ Enjoyed this project?

If you found SkillBridge useful, please consider giving this repository a **⭐ Star**.

It motivates me to build and share more open-source projects.

<br>

[![GitHub stars](https://img.shields.io/github/stars/nikhil-mca-code/skill?style=social)](https://github.com/nikhil-mca-code/skill)
[![GitHub forks](https://img.shields.io/github/forks/nikhil-mca-code/skill?style=social)](https://github.com/nikhil-mca-code/skill)

<br><br>

### Built with ❤️ using

**Next.js • React • TypeScript • Prisma • PostgreSQL • NextAuth • Tailwind CSS • Cloudinary**

<br>

© 2026 Nikhil Singh. All Rights Reserved.

</div>