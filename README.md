# 💼 JobGeniusAI – AI Career Coach

Your intelligent career companion powered by AI. Build professional resumes, craft personalized cover letters, and ace your interviews with AI-driven guidance.

## 🌟 Features

- **AI Resume Builder** - Create professional resumes with Markdown editor and PDF export
- **Cover Letter Generator** - Personalized cover letters for job applications
- **Interview Preparation** - AI-generated mock interviews with real-time feedback
- **Industry Insights** - Market trends, salary data, and skill recommendations
- **User Authentication** - Secure sign-in/sign-up with Clerk

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS, Shadcn UI
- **Backend**: Prisma ORM, PostgreSQL, Server Actions
- **AI**: Google Gemini API for smart recommendations
- **Authentication**: Clerk for secure user management

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Google Gemini API key
- Clerk authentication setup

### Installation

1. Clone the repository

```bash
git clone https://github.com/HailuBoc/jobgeniusai.git
cd JobGeniusAI
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Clerk Redirect URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/jobgenius_ai

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key
```

4. Set up database

```bash
npx prisma generate
npx prisma db push
```

5. Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
JobGeniusAI/
├── app/
│   ├── (main)/                 # Main app routes
│   │   ├── ai-cover-letter/    # Cover letter features
│   │   ├── dashboard/          # Industry insights
│   │   ├── interview/          # Interview preparation
│   │   ├── onboarding/         # User onboarding
│   │   └── resume/             # Resume builder
│   ├── api/                    # API routes
│   └── auth/                   # Authentication pages
├── components/                 # Reusable UI components
├── actions/                   # Server actions
├── lib/                       # Utility functions
├── prisma/                    # Database schema
└── public/                    # Static assets
```

## 🛠️ Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🌐 Deployment

Deploy to Vercel for best performance:

1. Connect your GitHub repository to Vercel
2. Add environment variables
3. Deploy automatically on push to main branch
