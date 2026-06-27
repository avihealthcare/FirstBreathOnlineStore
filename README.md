# AVI FirstBreath Store

Production-ready ecommerce MVP for AVI Healthcare Pvt Ltd to sell neonatal consumables and disposable NICU items through direct checkout and hospital purchase enquiry workflows.

## What Is Included

- Next.js App Router, TypeScript, Tailwind CSS, ShadCN-style UI primitives
- Product catalogue, search, filters, sorting, product detail pages, cart, checkout, and confirmation
- Email/password customer login before checkout
- Customer account area with profile, saved addresses, order history, repeat order, invoice placeholder, saved products, and recent purchases
- Protected admin panel for dashboard, product CRUD, categories, customers, orders, homepage hero, payment options, coupons, SEO, banners, testimonials, settings, and desktop/mobile preview
- Prisma schema and seed script for Supabase Postgres
- Local mock fallback so the store can render before live Supabase, Razorpay, ERP, or Cloudinary credentials are added
- Prisma-backed admin APIs for product, category, homepage, payment, coupon, order, and customer workflows

## Tech Stack

- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- ShadCN-style reusable components
- Prisma ORM with Supabase Postgres-ready schema
- Zustand for cart and customer state
- Zod and React Hook Form
- Framer Motion
- Lucide React
- Email/password customer and admin authentication using signed HttpOnly cookies
- Razorpay and Cloudinary placeholders

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

For production validation:

```bash
npm run typecheck
npm run build
```

## Environment

Use `.env.example` as the reference for required keys.

The app runs locally with mock data without Supabase credentials. To connect Supabase:

1. Add `DATABASE_URL` and `DIRECT_URL`.
2. Add public Supabase values only as `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
3. Keep `SUPABASE_SERVICE_ROLE_KEY`, admin/customer session secrets, admin passwords, and Razorpay secret keys server-only.
4. Run:

```bash
npm run prisma:migrate
npm run prisma:seed
```

Supabase’s current Prisma guidance recommends using a dedicated Prisma database user and the Supavisor transaction-pooler connection string for `DATABASE_URL`. On shared hosts such as Hostinger, use pooler port `6543` and keep Prisma’s pool small by adding `?pgbouncer=true&connection_limit=1&pool_timeout=20` to `DATABASE_URL`.

## Customer Login

- Checkout is protected by email/password customer login.
- Signup creates a `Customer` record with hashed password storage.
- Customer sessions use signed HttpOnly cookies.
- Customer profile details, default shipping address, and orders are persisted in Supabase through Prisma.

## Admin Access

The admin panel is not linked in the public header or footer. Open `/admin/login` directly.

Admin login is email/password based. For first deployment, either seed an admin user:

```bash
SEED_ADMIN_EMAIL="admin@avihealthcare.com" SEED_ADMIN_PASSWORD="replace-before-seeding" npm run prisma:seed
```

Or set server-only fallback variables on Hostinger:

```env
ADMIN_EMAIL="admin@avihealthcare.com"
ADMIN_PASSWORD="strong-production-password"
```

Set these fallback variables in Hostinger even when a Supabase admin user exists, so admin access still works during temporary database pool saturation.

Set `ADMIN_SESSION_SECRET`, `CUSTOMER_SESSION_SECRET`, and `NEXTAUTH_SECRET` before production deployment. `/admin` is protected by middleware and a signed server-side cookie.

Admin controls include product add/edit/delete, product picture URLs/uploads, selectable categories, customers, order status/internal notes, homepage hero content, payment methods with bank details, discount coupons, and desktop/mobile preview.

## Important Routes

- `/` homepage
- `/products` product listing
- `/products/[slug]` product detail
- `/cart` cart
- `/checkout` email-login protected checkout
- `/login` and `/signup`
- `/account`, `/account/orders`, `/account/addresses`, `/account/profile`
- `/admin`
- `/admin/login`
- `/quality`
- `/resources`
- `/policies/privacy`, `/policies/terms`, `/policies/shipping`, `/policies/returns`

## Launch Checklist

- Homepage complete
- Product listing complete
- Product detail complete
- Cart complete
- Checkout complete
- Login/signup complete
- Admin dashboard complete
- Product CRUD complete
- Homepage content management complete
- Payment option management complete
- Discount coupon management complete
- SEO fields complete
- Category management complete
- Order management complete
- Store settings complete
- Mobile responsive testing complete
- Desktop responsive testing complete
- Product images optimized
- Meta titles and descriptions added
- Privacy policy added
- Terms and conditions added
- Shipping policy added
- Return policy added
- Contact details verified
- Test order placed successfully
- Empty states checked
- Form validation checked
- Build passes without TypeScript errors
- Deployment-ready

## Next Production Steps

- Replace reference-cropped sample product images with approved product photography.
- Add role-based user management screens for multiple admin/staff users.
- Add RLS policies if exposing tables through Supabase Data API.
- Connect Razorpay keys and webhook handling.
- Add inventory, invoice, ERP, and logistics integrations.
