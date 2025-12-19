# Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables

Create a `.env` file in the root directory and add:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Setup Supabase Database

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the SQL script from `database/schema.sql`

### 4. Setup Firebase Authentication

1. Go to Firebase Console
2. Enable Email/Password authentication
3. Copy your Firebase config to `.env`

### 5. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Features Implemented

✅ **Tech Stack**
- Next.js 14 with TypeScript
- Supabase for database
- Firebase for authentication
- Vercel-ready deployment

✅ **Details Section**
- DropDowns for filtering
- Advanced Filters
- Table Sorting (click on headers)
- Phone Number with Country Code
- Delete Many with checkboxes
- AI Call Many feature

✅ **Performance Optimizations**
- Fast Login
- Fast Module Pages
- Fast Search
- Fast Table Loading
- Fast Pagination

## Deployment to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

The `vercel.json` is already configured.

