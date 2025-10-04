# 📦 Deployment

The application is deployed on Vercel. You can access the live demo here:
👉 https://dashboard-app-livid-omega.vercel.app/


# 📊 Dashboard App

A modern and responsive dashboard application built with Next.js, TypeScript, and Material UI (MUI).
It provides a scalable foundation for building admin panels, data visualizations, and analytics tools.

# 🚀 Features
# 🧩 Frontend

Next.js App Router — optimized routing and server-side rendering.

TypeScript — strong typing and cleaner developer experience.

Material UI (MUI) — modern, responsive design system.

Reusable Components — modular structure for widgets, layouts, and UI elements.

Dark/Light Theme Support (if implemented) — consistent theming using MUI’s theme system.

# 🗃️ Backend & Data Layer

Prisma ORM — defines and manages data models for future backend integration.

Schema-based Data Layer — provides a foundation for persistent data storage.

# ⚙️ Developer Experience

ESLint + Prettier — enforces consistent and clean code style.

Modular Folder Structure — easy navigation and scalability.

Environment Config — supports .env variables for sensitive credentials.

# 🗂️ Folder Structure
```text
dashboard-app/
│
├── prisma/                # Prisma schema and migration files (database layer)
│
├── public/                # Static assets (logos, icons, images)
│
├── src/
│   ├── app/               # Next.js app router pages and layouts
│   ├── components/        # Reusable UI components (cards, charts, tables, etc.)
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Helper and utility functions
│   ├── theme/             # MUI theme configuration
│   └── types/             # TypeScript interfaces and types
│
├── next.config.ts         # Next.js configuration
├── eslint.config.mjs      # ESLint rules and overrides
├── tsconfig.json          # TypeScript compiler options
└── package.json           # Dependencies and scripts
```

# 🧠 Technologies Used
| Category | Technology |
|-----------|-------------|
| **Framework** | Next.js (App Router) |
| **Language** | TypeScript |
| **UI Library** | Material UI (MUI) |
| **ORM** | Prisma |
| **Linting** | ESLint + Prettier |
| **Deployment** | Vercel |

# 🧩 Getting Started
```bash
# 1️⃣ Clone repository
git clone https://github.com/dakravchenko/dashboard-app.git
cd dashboard-app

# 2️⃣ Install dependencies
pnpm install

# 3️⃣ (Optional) Initialize database
pnpm prisma migrate dev

# 4️⃣ Run development server
pnpm dev
```

Then visit http://localhost:3000

# 🐞 Known Issues
- backend sorting is not persistent (some tasks have the same level property)
# 🚧 To Be Implemented
- task table view
- loading states and components 
