# Mother & Infant Emergency Pod ("Night Pod")

Request essential baby supplies when the shops are closed.
Next.js (frontend) · Node.js + Express (backend) · MongoDB (database)

## Run it

```bash
# 1. Backend  (needs MongoDB: local, or an Atlas URI in backend/.env)
cd backend
npm install
npm run seed      # 6 products + demo accounts
npm run dev       # http://localhost:5000

# 2. Frontend (new terminal)
cd frontend
npm install
npm run dev       # http://localhost:3000
```

Demo logins: `admin@pod.com / Admin@123` and `parent@pod.com / Parent@123`.

## Structure (MVC + services)

```
backend/src
  models/        Mongoose schemas (User, Product, Order)         -> M
  controllers/   thin HTTP layer: read request, call service     -> C
  services/      all business rules (stock, status flow, auth)
  routes/        URL -> controller wiring
  validators/    zod schemas for every request body
  middleware/    auth (JWT cookie), role guard, validate, errors
  utils/         ApiError, asyncHandler, response helper, constants
  config/ seed/  env, DB connection, sample data

frontend/src
  app/           pages (home, products, request, orders, admin, login)  -> V
  components/    ui/ (reusable) · layout/ · product/ · order/ · admin/
  context/       AuthContext, CartContext
  services/      API calls per resource (no fetch inside pages)
  hooks/         useAsync
  lib/           api client, constants, formatters
  types/         shared TypeScript types
```

## Request flow

PENDING -> CONFIRMED -> PREPARING -> DISPATCHED -> DELIVERED
(admin may also REJECT a pending request or CANCEL a confirmed one; parents may cancel while PENDING)

- Stock is only deducted when an admin **confirms**, using atomic `$gte` updates so two
  requests can never take the same unit. Cancelling a confirmed request restocks.
- Prices always come from the database, never from the browser.
- Passwords are hashed (bcrypt); login uses an httpOnly JWT cookie.

## Safety

The app delivers supplies; it does not give medical advice. A notice with the emergency
number appears on the home, supplies and request pages. Product cards show age suitability
and warnings. Edit `EMERGENCY_NUMBER` in `frontend/src/lib/constants.ts` if needed.

## Deploy notes

Set `NODE_ENV=production`, `CLIENT_URL` (backend) and `NEXT_PUBLIC_API_URL` (frontend).
Cross-site cookies in production require HTTPS.
