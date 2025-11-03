# 🍺 Beer Inventory App

A simple Next.js application to manually add and track your beer collection.

## Setup Instructions

### 1. Database Setup

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/bfnxggauazjyupvgnpbr
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the contents of supabase-migration.sql and paste it
5. Click **Run** to create the beers table

### 2. Environment Variables

The .env.local file is already configured with your Supabase credentials:
- Supabase URL: https://bfnxggauazjyupvgnpbr.supabase.co
- Anon Key: Already set

**Important:** Make sure .env.local is in your .gitignore to keep your keys private!

### 3. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- ✅ Add new beers with details (name, brewery, type, ABV, IBU, notes)
- ✅ View all beers in a card-based layout
- ✅ Automatic sorting by date added (newest first)
- ✅ Responsive design with Tailwind CSS

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Supabase** (Database & Backend)
- **Tailwind CSS** (Styling)

## Database Schema

The eers table includes:
- id (UUID) - Primary key
- 
ame (Text) - Required
- rewery (Text)
- 	ype (Text) - e.g., IPA, Lager, Stout
- bv (Decimal) - Alcohol by volume percentage
- ibu (Integer) - International Bitterness Units
- 
otes (Text)
- created_at (Timestamp)

## Next Steps

- Add delete functionality
- Add edit functionality
- Add search/filter
- Add beer ratings
- Add image upload
