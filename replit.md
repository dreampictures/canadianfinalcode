# Canadian Luxurious Salon - Project Documentation

## Overview
A luxury salon website with certificate verification system. Features include:
- Public website with services, gallery, about, and contact pages
- Certificate verification system for students (no QR code generation)
- Admin panel for managing certificates, gallery, and contact messages
- Session-based authentication

## Tech Stack
- **Frontend**: React + Vite + TailwindCSS + shadcn/ui
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Auth**: Passport.js with session-based authentication

## Color Theme
- Primary: Vibrant Orange (#F26522) - matches logo
- Secondary: Golden/Amber (#DC8C3C) - complements orange
- Background: Cream (#FAF9F6)
- Foreground: Dark orange-brown for better text visibility
- Fonts: Playfair Display (headings), Inter (body)

## Glass Gradient Design (iOS Style)
- `.glass-header`: Frosted glass navigation with blur effect
- `.glass-button`: Light translucent button with depth
- `.glass-button-primary`: Orange gradient button with glass effect
- `.glass-button-secondary`: Amber gradient button with glass effect
- `.glass-card`: Frosted glass card container
- `.water-drop-gradient`: Blue aquatic gradient with backdrop blur for forms
- `.water-drop-input`: Frosted glass input styling

## Key Routes
- `/` - Home page
- `/services` - Services and courses
- `/gallery` - Portfolio gallery
- `/about` - About the salon
- `/contact` - Contact form
- `/verify` - Certificate verification (public)
- `/login` - Admin login (manual access only - no public link)
- `/admin` - Admin dashboard (protected)

## Admin Access
- Navigate manually to `/login`
- Login form has security enhancements: hidden username field, password visibility toggle
- Dashboard only visible in nav when logged in

## Gallery Albums
- Gallery uses album-based system (max 10 photos per album)
- Albums stored with URLs only (OneDrive embedded images supported)
- Navigation arrows and image indicators for multi-photo albums
- Categories: Hair, Makeup, Nails, Academy

## API Endpoints
- `GET /api/health` - Health check
- `GET /api/certificates/verify/:certificateNumber` - Verify certificate
- `GET /api/gallery` - Get gallery items
- `POST /api/contact` - Submit contact message
- Admin routes require authentication

## Contact Information
- Address: Shop No. 2 Dharamkot Road Jogewala, Ferozepur, PB 142044 IN
- Phone: +91 90561 63862
- Email: info@canadianluxurioussalon.com

## Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Secret for session encryption

---

## Fly.io Deployment Guide

### Prerequisites
1. Install Fly CLI: https://fly.io/docs/hands-on/install-flyctl/
2. Create Fly.io account: https://fly.io/

### Deployment Steps

```bash
# 1. Login to Fly.io
fly auth login

# 2. Launch the app (first time only)
# This will detect fly.toml and create the app
fly launch --no-deploy

# 3. Create PostgreSQL database
fly postgres create --name canadian-salon-db

# 4. Attach database to your app
fly postgres attach canadian-salon-db

# 5. Set session secret
fly secrets set SESSION_SECRET="your-super-secret-key-here"

# 6. Deploy the application
fly deploy

# 7. Open your app
fly open
```

### Useful Commands

```bash
# View logs
fly logs

# SSH into container
fly ssh console

# Check app status
fly status

# Scale machines
fly scale count 1

# Run database migrations (if needed)
fly ssh console -C "npm run db:push"
```

### Database Access
```bash
# Connect to database directly
fly postgres connect -a canadian-salon-db
```

### Troubleshooting
- If deployment fails, check logs: `fly logs`
- Ensure DATABASE_URL is set: `fly secrets list`
- Health check endpoint: `/api/health`
