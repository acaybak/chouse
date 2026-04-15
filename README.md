# C House Monorepo (MVP)

Monorepo scaffold for **C House** loyalty application:

- `apps/mobile` → Flutter mobile app (TR/EN, Google sign-in + SMS OTP flow, wallets, menu, notifications)
- `apps/admin` → Next.js admin/POS panel (dashboard, users, cashiers, add points, menu, notifications)
- `apps/api` → NestJS API with PostgreSQL persistence and JWT auth

## Requirements

- Node.js 20+
- npm 10+
- Docker + Docker Compose
- Flutter SDK (for mobile)

## Environment files

Copy and edit:

- `apps/api/.env.example` → `apps/api/.env`
- `apps/admin/.env.example` → `apps/admin/.env.local`
- `apps/mobile/.env.example` (for mobile runtime setup)

## Run with Docker (Postgres + API)

```bash
docker compose up --build
```

API runs at `http://localhost:3000`.

### Seed initial admin

```bash
cd /home/runner/work/chouse/chouse/apps/api
npm run seed
```

Default seeded admin email: `admin@chouse.local`.

## Run API locally

```bash
cd /home/runner/work/chouse/chouse/apps/api
npm install
npm run start:dev
```

## Run Admin locally

```bash
cd /home/runner/work/chouse/chouse/apps/admin
npm install
npm run dev
```

Then open `http://localhost:3001` (or the port Next.js shows).

## Run Mobile locally

```bash
cd /home/runner/work/chouse/chouse/apps/mobile
flutter pub get
flutter run
```

## Backend endpoints (MVP)

- `POST /auth/google`
- `POST /auth/otp/send`
- `POST /auth/otp/verify`
- `GET /wallets/my`
- `POST /wallets/transactions` (admin/cashier)
- `GET /menu` (public)
- `GET/POST/PATCH/DELETE /menu/admin/categories` (admin)
- `GET/POST/PATCH/DELETE /menu/admin/items` (admin)
- `POST /notifications` (admin, FCM stub)
- `GET /notifications/my`
- `GET /users`, `GET/POST /users/cashiers`, `GET /users/by-phone/:phone`

## Notes

- Google login endpoint currently accepts token exchange payload and includes a production TODO for full Google token verification.
- SMS OTP and push notification sending use development stubs with clear TODOs and env vars.
- Loyalty transaction model supports flexible fields (`transactionType`, `source`, `amountPoints`, `amountTl`, `metadata`) for future rules engine work.
