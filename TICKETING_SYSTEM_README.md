# 🎫 IT Helpdesk / Ticketing System

Sistem IT Helpdesk / Ticketing System yang terintegrasi dengan SSO untuk autentikasi. Sistem ini mendukung berbagai role dan fitur lengkap untuk manajemen tiket IT.

## 🚀 Fitur Utama

### 👤 User (Requester Portal)
- **Dashboard**: Ringkasan tiket dengan status (Open, In Progress, Resolved, Closed)
- **Buat Tiket Baru**: Form lengkap dengan kategori, prioritas, deskripsi, dan lampiran
- **Daftar Tiket Saya**: Tabel tiket dengan filter dan pencarian
- **Detail Tiket**: Informasi lengkap dengan timeline aktivitas
- **Komentar**: Menambahkan komentar dan update informasi
- **Upload File**: Menambahkan lampiran tambahan
- **Close Tiket**: Menutup tiket sendiri jika masalah sudah beres

### 🛠️ IT Staff Portal
- **Dashboard**: Ringkasan tiket by status dan SLA monitoring
- **Daftar Tiket**: Semua tiket dengan filter dan pencarian
- **Assign Tiket**: Menugaskan tiket ke teknisi tertentu
- **Update Status**: Mengubah status tiket (Open, In Progress, On Hold, Resolved, Closed)
- **Komentar Teknisi**: Menambahkan komentar dan update progress
- **Upload File**: Menambahkan screenshot hasil perbaikan, laporan, dll
- **SLA Monitoring**: Memantau tiket yang mendekati atau melewati SLA

### 👨‍💼 Manager IT / Supervisor
- **Dashboard KPI**: SLA compliance %, jumlah tiket selesai vs overdue
- **Laporan SLA**: Tiket yang melanggar SLA
- **Laporan per Teknisi**: Performa tiap staff IT
- **Laporan per Divisi**: Divisi mana paling banyak minta bantuan IT
- **Export Laporan**: Export ke Excel/PDF

### 🔧 Admin System
- **Master User**: CRUD user dengan role (User, IT Staff, Manager, Admin)
- **Master Kategori Tiket**: CRUD kategori (Hardware, Software, Network, Access, dll)
- **Master Prioritas & SLA**: CRUD prioritas dan aturan SLA
- **Pengaturan Sistem**: Email SMTP, notifikasi, logo perusahaan

## 🗄️ Database Schema

### Tabel Utama
- **users**: Data pengguna (terintegrasi dengan SSO)
- **tickets**: Data tiket dengan status, SLA, dan assignment
- **ticket_comments**: Komunikasi dan update dari user atau staff IT
- **ticket_attachments**: File/lampiran tiket
- **categories**: Kategori tiket (hardware, software, network, dll)
- **priorities**: Level prioritas tiket (low, medium, high, critical)
- **sla_rules**: Aturan SLA berdasarkan prioritas

### Relasi Database
```
users (1) → (M) tickets
users (1) → (M) ticket_comments
users (1) → (M) ticket_attachments
tickets (1) → (M) ticket_comments
tickets (1) → (M) ticket_attachments
categories (1) → (M) tickets
priorities (1) → (M) tickets
priorities (1) → (M) sla_rules
```

## 🔄 Alur Tiket

1. **User** membuat tiket baru → Status: **OPEN**
2. **IT Staff** assign tiket ke teknisi → Status: **IN_PROGRESS**
3. **Teknisi** update progress dan komentar
4. **Teknisi** mark as **RESOLVED** → User mendapat notifikasi
5. **User** review dan **CLOSE** tiket → Status: **CLOSED**

## 📊 Status Tiket

- **open**: Tiket baru dibuat, belum ditugaskan
- **in_progress**: Tiket sedang ditangani
- **on_hold**: Tiket ditunda (menunggu informasi/part/approval)
- **resolved**: Tiket sudah selesai diperbaiki, menunggu konfirmasi user
- **closed**: Tiket sudah ditutup

## 🚨 Prioritas & SLA

### Prioritas
- **Low** (Level 1): Prioritas rendah - dapat diselesaikan dalam beberapa hari
- **Medium** (Level 2): Prioritas sedang - harus diselesaikan dalam 1-2 hari
- **High** (Level 3): Prioritas tinggi - harus diselesaikan dalam beberapa jam
- **Critical** (Level 4): Prioritas kritis - harus diselesaikan segera

### SLA Rules
- **Low**: 72 jam (3 hari)
- **Medium**: 48 jam (2 hari)
- **High**: 24 jam (1 hari)
- **Critical**: 8 jam

## 🔐 Autentikasi & Authorization

Sistem menggunakan **SSO (Single Sign-On)** yang sudah ada untuk autentikasi. Semua endpoint memerlukan token SSO yang valid.

### Role-based Access Control
- **User**: Hanya bisa melihat dan mengelola tiket sendiri
- **IT Staff**: Bisa melihat semua tiket dan menangani yang ditugaskan
- **Manager**: Bisa melihat semua tiket dan laporan
- **Admin**: Akses penuh ke semua fitur dan master data

## 🚀 Instalasi & Setup

### 1. Jalankan Migration dan Seeder
```bash
# Jalankan script setup
./setup-ticketing-system.sh

# Atau manual
knex migrate:latest
knex seed:run
```

### 2. Konfigurasi Email (Opsional)
Edit file konfigurasi email untuk notifikasi:
```javascript
// src/config/email.js
module.exports = {
  smtp: {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-app-password'
    }
  }
}
```

### 3. Konfigurasi MinIO (Opsional)
Edit file konfigurasi MinIO untuk file storage:
```javascript
// src/config/minio.js
module.exports = {
  endPoint: 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: 'minioadmin',
  secretKey: 'minioadmin'
}
```

## 📡 API Endpoints

### Base URL
```
http://localhost:3000/api/v1
```

### Endpoint Utama
- **Categories**: `/categories` - Kelola kategori tiket
- **Priorities**: `/priorities` - Kelola prioritas tiket
- **SLA Rules**: `/sla-rules` - Kelola aturan SLA
- **Tickets**: `/tickets` - Kelola tiket
- **Comments**: `/ticket-comments` - Kelola komentar tiket
- **Attachments**: `/ticket-attachments` - Kelola lampiran tiket
- **Dashboard**: `/dashboard` - Dashboard untuk berbagai role

### Contoh Penggunaan

#### 1. Membuat Tiket Baru
```bash
curl -X POST http://localhost:3000/api/v1/tickets \
  -H "Authorization: Bearer <sso_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "category_id": "category-uuid",
    "priority_id": "priority-uuid",
    "title": "Masalah printer tidak bisa print",
    "description": "Printer di lantai 3 tidak bisa print dokumen..."
  }'
```

#### 2. Menugaskan Tiket
```bash
curl -X PUT http://localhost:3000/api/v1/tickets/ticket-uuid/assign \
  -H "Authorization: Bearer <sso_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "assigned_to": "staff-uuid"
  }'
```

#### 3. Upload Lampiran
```bash
curl -X POST http://localhost:3000/api/v1/ticket-attachments/upload \
  -H "Authorization: Bearer <sso_token>" \
  -F "ticket_id=ticket-uuid" \
  -F "description=Screenshot error printer" \
  -F "files=@screenshot.png"
```

## 📖 Dokumentasi Lengkap

Lihat file `TICKETING_API_DOCUMENTATION.md` untuk dokumentasi API yang lengkap dengan semua endpoint, parameter, response format, dan contoh penggunaan.

## 🔧 Teknologi yang Digunakan

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL dengan Knex.js
- **Authentication**: SSO (Single Sign-On)
- **File Storage**: MinIO
- **Email**: Nodemailer
- **Validation**: Joi
- **File Upload**: Multer

## 📝 Catatan Penting

1. **Authentication**: Semua endpoint memerlukan token SSO yang valid
2. **File Upload**: Maksimal 5 file per request, maksimal 10MB per file
3. **Notifications**: Sistem mengirim notifikasi email otomatis untuk update tiket
4. **SLA Monitoring**: Sistem memantau SLA dan menandai tiket yang overdue
5. **Role-based Access**: Setiap endpoint memiliki kontrol akses berdasarkan role user
6. **Database**: Menggunakan PostgreSQL dengan UUID sebagai primary key

## 🎯 Roadmap

- [ ] Integrasi dengan WhatsApp/Telegram untuk notifikasi
- [ ] Mobile app untuk IT staff
- [ ] Advanced reporting dan analytics
- [ ] Integration dengan monitoring tools
- [ ] Automated ticket routing berdasarkan kategori
- [ ] Knowledge base integration
- [ ] SLA escalation workflows

## 🤝 Kontribusi

Sistem ini dibangun berdasarkan blueprint, ERD, dan flowchart yang telah ditentukan. Untuk pengembangan lebih lanjut, silakan ikuti struktur yang sudah ada dan dokumentasi API yang lengkap.

## 📞 Support

Untuk pertanyaan atau bantuan teknis, silakan hubungi tim development atau lihat dokumentasi API yang tersedia.
