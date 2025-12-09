# project-api-siakad-zod
Backend REST API untuk Sistem Catatan Akademik (Siakad) menggunakan Next.js (App Router), PostgreSQL, Prisma ORM (v6.19.0), bcrypt, JWT, middleware authentication, role-based authorization, dan validasi **Zod**.

# Dikerjakan oleh:
1. Moh. Anwar Musadad - 23104410116
2. Riza Kumalasari - 23104410112
3. Miftakul Huda - 23104410099
4. Mahsunah Ulfah - 25104415001

## Fitur
- Register & Login (bcrypt hashing, JWT Bearer)
- Middleware untuk validasi JWT dan proteksi route
- Role-based authorization (Admin/User)
- CRUD data **students** (route `/api/items`) dengan proteksi lengkap
- Response format konsisten
- Validasi server-side menggunakan **Zod** pada Register, Login, dan CRUD Students
- Postman collection untuk pengujian

## Menjalankan
1. Salin `.env.example` menjadi `.env` dan sesuaikan `DATABASE_URL` (utamanya Password PostgreSQL) & `JWT_SECRET`.
2. Install dependencies: `npm install`
3. Generate Prisma Client & migrasi: `npm run prisma:generate` lalu `npm run prisma:migrate`
4. Jalankan dev server: `npm run dev`

## Endpoint
- Public: `/api/auth/register`, `/api/auth/login`
- Admin only: `/api/users/*`
- Protected (User/Admin): `/api/items/*` (DELETE hanya Admin)

## Testing
Gunakan koleksi pada `postman/project-api-siakad.postman_collection.json`. Set `{{baseUrl}}` dan `{{token}}`.
