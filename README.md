# AVI FirstBreath Store

Production-ready ecommerce MVP for AVI Healthcare Pvt Ltd to sell neonatal consumables and disposable NICU items through direct checkout and hospital purchase enquiry workflows.

## What Is Included

- Next.js App Router, TypeScript, Tailwind CSS, ShadCN-style UI primitives
- Product catalogue, search, filters, sorting, product detail pages, cart, checkout, and confirmation
- Mobile OTP login before checkout with mock OTP `123456`
- Customer account area with profile, saved addresses, order history, repeat order, invoice placeholder, saved products, and recent purchases
- Protected admin panel for dashboard, product CRUD UI, homepage hero, SEO, categories, orders, payment options, coupons, banners, testimonials, settings, and desktop/mobile preview
- Prisma schema and seed script for Supabase Postgres
- Local mock data layer so the store works before live Supabase, Razorpay, SMS, ERP, or Cloudinary credentials are added
- Browser-persisted admin MVP settings with Prisma schema placeholders for later Supabase persistence

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
- Auth.js/NextAuth-ready login UI
- Razorpay, SMS provider, and Cloudinary placeholders

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
3. Keep `SUPABASE_SERVICE_ROLE_KEY`, SMS provider keys, and Razorpay secret keys server-only.
4. Run:

```bash
npm run prisma:migrate
npm run prisma:seed
```

Supabase’s current Prisma guidance recommends using a dedicated Prisma database user and the Supavisor pooler connection string for `DATABASE_URL`.

## OTP MVP

- Checkout is protected by mobile OTP login.
- Indian mobile number validation is included.
- Mock OTP request/verify endpoints live in `src/app/api/otp`.
- The MVP OTP is `123456` through `OTP_FIXED_CODE`.
- Rate-limit, expiry, and attempt-count placeholders are implemented.
- SMS providers such as MSG91, Twilio, Gupshup, or Fast2SMS can replace the mock send path later.

## Admin Access

The admin panel is not linked in the public header or footer. Open `/admin/login` directly.

Local default admin code:

```text
AVI-FIRSTBREATH-ADMIN
```

Set `ADMIN_ACCESS_CODE` and `ADMIN_SESSION_SECRET` before production deployment. `/admin` is protected by middleware and a signed server-side cookie.

Admin MVP controls include product add/edit/delete, product picture URLs/uploads, homepage hero content, payment methods with bank details, discount coupons, and desktop/mobile preview.

## Important Routes

- `/` homepage
- `/products` product listing
- `/products/[slug]` product detail
- `/cart` cart
- `/checkout` OTP-protected checkout
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
- Login/signup UI complete
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
- Connect browser-persisted admin actions to API routes backed by Prisma and Supabase.
- Replace local admin access code with production authentication and role-based authorization for `/admin`.
- Add RLS policies if exposing tables through Supabase Data API.
- Connect SMS provider for OTP delivery.
- Connect Razorpay keys and webhook handling.
- Add inventory, invoice, ERP, and logistics integrations.
