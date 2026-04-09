# Contributing to PlanWise

Thank you for your interest in contributing to PlanWise! We're excited to have you join us. Whether you're fixing bugs, improving the documentation, or adding new features, this guide will help you get started.

## Project Overview

PlanWise is a productivity and task management app built with:
- **Framework**: Next.js (App Router, React 19)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS & shadcn/ui components
- **AI Integration**: Google Generative AI (Gemini)

---

## 🚀 Getting Started (Local Setup)

To run this project locally, follow these steps:

### 1. Prerequisites
Make sure you have the following installed:
- Node.js (v20 or higher)
- npm or yarn
- PostgreSQL (running locally or via a cloud provider like Supabase/Neon)
- Git

### 2. Fork and Clone the Repository
```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/PlanWise.git
cd PlanWise

# Add the upstream remote
git remote add upstream https://github.com/iiitl/PlanWise.git
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Environment Variables
Create a `.env` file in the root of the project. You will need to provide the following variables:

```env
# Database connection string (PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/planwise?schema=public"

# NextAuth Configuration
# Generate a secret by running: openssl rand -base64 32
AUTH_SECRET="your-super-secret-key-here"

# Google OAuth (if you want to test social login)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# AI Integration (Gemini)
# Get a key from Google AI Studio
GEMINI_API_KEY="your-gemini-api-key"
```

### 5. Setup the Database
Push the Prisma schema to your database and generate the Prisma Client:
```bash
npx prisma db push
npx prisma generate
```

### 6. Run the Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

---

## 🛠️ How to Contribute

### 1. Find an Issue
We label issues that are great for newcomers with the `good-first-issue` label. If you want to work on something:
- Check the [Issues tab](../../issues) and find an unassigned issue.
- Leave a comment asking to be assigned to it so others know it's being worked on.

### 2. Create a Branch
Always create a new branch for your work. Use a descriptive name:
```bash
# Make sure your main branch is up-to-date
git checkout main
git pull upstream main

# Create your feature/fix branch
git checkout -b feature/your-feature-name
# or for bugs:
git checkout -b fix/your-bug-fix
```

### 3. Make Your Changes
Write your code! We appreciate clean, well-documented code. Since we use TypeScript, make sure your types are strict—please avoid using `any` whenever possible.

### 4. Commit Your Changes
Use clear and descriptive commit messages. We use conventional commits:
- `feat: add new calendar view`
- `fix: resolve issue with bulk todo updates`
- `docs: update contributing guidelines`

```bash
git add .
git commit -m "feat: add user profile context"
```

### 5. Push and Open a PR
```bash
git push origin your-branch-name
```
Go to the original PlanWise repository and you'll see a prompt to open a Pull Request.

In your PR description:
- Explain what you changed.
- Reference the issue you are fixing (e.g., `Fixes #1`).
- Add any relevant screenshots.

---

## Code Quality Standards
- **TypeScript**: We prefer strict typing. Avoid `any` types and use the generated Prisma types found in `@/app/generated/prisma`.
- **Components**: We use functional React components with hooks.
- **Styling**: Use Tailwind CSS utility classes. Avoid writing custom CSS unless absolutely necessary.

## Need Help?
If you're stuck, feel free to ask questions in the issue you are working on! We're here to help you get your first PR merged.