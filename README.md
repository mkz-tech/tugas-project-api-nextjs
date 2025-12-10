## project-api-siakad-zod
(Project Sistem Manajemen Akademik – REST API (Next.js + Prisma + PostgreSQL)
- Project ini adalah implementasi UAS mata kuliah Pemrograman API menggunakan:
	- Next.js App Router (API Routes)
	- PostgreSQL
	- Prisma ORM
	- bcrypt untuk hashing password
	- JWT untuk autentikasi
	- Middleware untuk authentication & role-based authorization
	- CRUD Students sebagai entitas utama
- Project ini dapat dijalankan sepenuhnya di localhost menggunakan Node.js + VSCode.

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

## Struktur Folder Project (Ringkas)
	root
	├── app
	│   ├── api
	│   │   ├── auth
	│   │   │   ├── login/route.js
	│   │   │   └── register/route.js
	│   │   ├── students
	│   │   │   ├── route.js            (GET all, POST create)
	│   │   │   └── [id]/route.js       (GET by id, PATCH/PUT, DELETE)
	│   │   └── users/...
	├── lib
	│   └── prisma.js
	├── prisma
	│   ├── schema.prisma
	│   └── migrations/...
	├── utils
	│   ├── response.js
	│   └── validators.js
	├── middleware.js
	├── .env.example
	├── package.json
	└── README.md

## Persyaratan Sistem (Wajib Dipenuhi)
- Pastikan tools berikut sudah terpasang:
	- ✔ Node.js (Versi 18 atau lebih baru)
		- Download: https://nodejs.org
	- ✔ PostgreSQL
		- Download: https://www.postgresql.org/download/
- Default konfigurasi PostgreSQL:
	Host: localhost
	Port: 5432
	User: postgres
	Password: (sesuai instalasi)
	Database: api-siakad
- VSCode
- Postman

## Cara Instalasi Project
- Clone repo GitHub:
	git clone https://github.com/mkz-tech/tugas-project-api-nextjs.git
- Masuk ke folder project:
	cd tugas-project-api-nextjs
Install dependency:
	npm install
	
## Setup Environment Variable
- Dikarenakan file .env tidak boleh diupload ke GitHub, maka rename file `.env.example` menjadi `.env`
- Isi .env seperti berikut:
	- DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/api-siakad
	- JWT_SECRET=rahasia_negara_ini_jangan_disebar
	- NODE_ENV=development
	
## Prisma Setup (Database & Migrasi)
- Buat database terlebih dahulu lewat PostgreSQL:
	- `createdb api-siakad`
- Lalu jalankan migrasi:
	- `npx prisma migrate dev --name init`
	
## Menjalankan Project
- Mulai server development:
	- `npm run dev`
	
## Endpoint API
- Auth (public)
  - POST `/api/auth/register` -> Mendaftarkan user baru (default role: User)
  - POST `/api/auth/login` -> Menghasilkan JWT token.
      -  Response:
            - {
            - "success": true,
            - "message": "Login success",
            - data": {"token": "xxx"}
            - }

		Gunakan header:   
		Authorization: Bearer <token>
		
## Middleware Authentication + Authorization
- Middleware menangani:
	- Route						        Hak Akses
	- `/api/auth/*`					  Public
	- `/api/users/*`				  Admin only
	- `/api/students/*`			  Hanya user login (Admin/User)
	- `DELETE /students/*`		Admin Only
- Middleware juga menambahkan header otomatis:
	- x-user-id
	- x-user-email
	- x-user-role

## CRUD Students (Protected Route)
- Semua route `/api/students/*` membutuhkan:
	`Authorization: Bearer <token>`
- GET `/api/students ->` Mengambil semua data student.
- GET `/api/students/:id` -> Mengambil detail student.
- POST `/api/students` -> Menambah student baru.
- PUT `/api/students/:id` -> Mengubah data student.
- DELETE `/api/students/:id` -> Menghapus data student (Admin Only).

## ## Testing
- Pada folder postman terdapat file `postman_collection.json`
	- ->Impor ke Postman, ganti `{{baseUrl}}` variable ke `http://localhost:3000`
- Setelah import dan konfigurasi variabel, lakukan pengujian sebagai berikut:
    - POST `http://localhost:3000/api/auth/register` → body name,email,password
    - POST `http://localhost:3000/api/auth/login` → dapat { token }
    - Inject token di environment {{token}}
    - POST `http://localhost:3000/api/students` → buat student
    - GET `http://localhost:3000/api/students` → harus sukses
    - GET `http://localhost:3000/api/students/:id` → cek by id
    - PUT `http://localhost:3000/api/students/:id` → update
    - DELETE `http://localhost:3000/api/students/:id` → harus cek role = Admin (jika bukan, 403)

## Cara merubah role (dari User ke Admin)
- `psql -U postgres -h localhost -p 5432`
- masukkan password PostgreSQL
- `\l`
- `\c nama_database` (contoh: `\c api-siakad`)
- `\dt`
- `SELECT id, name, email, role FROM "User";`
- `UPDATE "User" SET role='Admin' WHERE email='admin1@unisba.com';` (Sesuaikan email)
