# Supabase Repository

All content (blogs, certs) is stored in Supabase. No local static files.

## Setup

1. **Run migrations** in Supabase SQL Editor (Dashboard → SQL Editor):
   - `migrations/001_blogs.sql`
   - `migrations/002_certs.sql`

2. **Set env vars** in `.env`:
   ```
   SUPABASE_URL=https://yourproject.supabase.co
   SUPABASE_KEY=your-anon-key
   ```

3. Add blogs and certs via Supabase Dashboard (Table Editor) or API.

## Tables

- **blogs** — slug, title, excerpt, content (markdown), tags, difficulty, os, date
- **certs** — id, name, issuer, date, url, badge_url, description
