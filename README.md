# project-api-siakad-zod
Backend REST API untuk Sistem Catatan Akademik (Siakad) menggunakan Next.js (App Router), PostgreSQL, Prisma ORM (v6.19.0), bcrypt, JWT, middleware authentication, role-based authorization, dan validasi **Zod**.

# Dikerjakan oleh:
1. Moh. Anwar Musadad - 23104410116
2. Muhammad Riza Kumalasari - 23104410112
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
- POST /api/auth/register → register (role default: User)
- POST /api/auth/login → login → get token { token }
- GET /api/students → get all (Authorization required)
- POST /api/students → create student (Authorization required)
- GET /api/students/:id → get by id (Authorization required)
- PATCH /api/students/:id → update (Authorization required)
- DELETE /api/students/:id → delete (Admin only)

## Testing
`postman_collection.json` > Impor ini ke Postman, ganti `{{baseUrl}}` variable ke `http://localhost:3000`
Setelah import dan konfigurasi variabel, lakukan pengujian sebagai berikut:
1. POST /api/auth/register → body name,email,password
2. POST /api/auth/login → dapat { token }
3. Inject token di environment {{token}}
4. POST /api/students → buat student
5. GET /api/students → harus sukses
6. GET /api/students/:id → cek by id
7. PATCH /api/students/:id → update
8. DELETE /api/students/:id → harus cek role = Admin (jika bukan, 403)

## cara merubah role
- psql -U postgres -h localhost -p 5432
- masukkan password PostgreSQL
- \l
- \c nama_database (contoh: \c api-siakad)
- \dt
- SELECT id, name, email, role FROM "User";
- UPDATE "User" SET role='Admin' WHERE email='admin1@unisba.com'; (Sesuaikan email)
