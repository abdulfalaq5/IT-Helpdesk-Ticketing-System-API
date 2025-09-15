# 🎫 IT Helpdesk / Ticketing System API Documentation

## Overview
Sistem IT Helpdesk / Ticketing System yang terintegrasi dengan SSO untuk autentikasi. Sistem ini mendukung berbagai role: User (Requester), IT Staff, Manager, dan Admin.

## Base URL
```
http://localhost:3000/api/v1
```

## Authentication
Sistem menggunakan SSO untuk autentikasi. Semua endpoint memerlukan token SSO yang valid.

## API Endpoints

### 📂 Categories (Master Data Kategori)

#### GET /categories
Mendapatkan daftar semua kategori tiket.

**Query Parameters:**
- `search` (string, optional): Pencarian berdasarkan nama atau deskripsi
- `is_active` (boolean, optional): Filter berdasarkan status aktif

**Response:**
```json
{
  "success": true,
  "message": "Daftar kategori berhasil ditemukan",
  "data": [
    {
      "id": "uuid",
      "name": "Hardware",
      "description": "Masalah terkait perangkat keras komputer",
      "is_active": true,
      "created_at": "2025-01-10T00:00:00.000Z",
      "updated_at": "2025-01-10T00:00:00.000Z"
    }
  ]
}
```

#### GET /categories/active
Mendapatkan daftar kategori aktif saja.

#### GET /categories/:id
Mendapatkan detail kategori berdasarkan ID.

#### POST /categories
Membuat kategori baru. (Admin only)

**Request Body:**
```json
{
  "name": "Hardware",
  "description": "Masalah terkait perangkat keras komputer",
  "is_active": true
}
```

#### PUT /categories/:id
Memperbarui kategori. (Admin only)

#### DELETE /categories/:id
Menghapus kategori. (Admin only)

---

### 🚨 Priorities (Master Data Prioritas)

#### GET /priorities
Mendapatkan daftar semua prioritas tiket.

**Query Parameters:**
- `search` (string, optional): Pencarian berdasarkan nama atau deskripsi
- `is_active` (boolean, optional): Filter berdasarkan status aktif

**Response:**
```json
{
  "success": true,
  "message": "Daftar prioritas berhasil ditemukan",
  "data": [
    {
      "id": "uuid",
      "name": "High",
      "description": "Prioritas tinggi - harus diselesaikan dalam beberapa jam",
      "level": 3,
      "color": "#fd7e14",
      "is_active": true,
      "created_at": "2025-01-10T00:00:00.000Z",
      "updated_at": "2025-01-10T00:00:00.000Z"
    }
  ]
}
```

#### GET /priorities/active
Mendapatkan daftar prioritas aktif saja.

#### GET /priorities/:id
Mendapatkan detail prioritas berdasarkan ID.

#### POST /priorities
Membuat prioritas baru. (Admin only)

**Request Body:**
```json
{
  "name": "High",
  "description": "Prioritas tinggi - harus diselesaikan dalam beberapa jam",
  "level": 3,
  "color": "#fd7e14",
  "is_active": true
}
```

#### PUT /priorities/:id
Memperbarui prioritas. (Admin only)

#### DELETE /priorities/:id
Menghapus prioritas. (Admin only)

---

### ⏰ SLA Rules (Aturan SLA)

#### GET /sla-rules
Mendapatkan daftar semua SLA rules.

**Query Parameters:**
- `priority_id` (uuid, optional): Filter berdasarkan ID prioritas
- `is_active` (boolean, optional): Filter berdasarkan status aktif

#### GET /sla-rules/with-priority
Mendapatkan SLA rules dengan detail prioritas.

#### GET /sla-rules/active
Mendapatkan daftar SLA rules aktif saja.

#### GET /sla-rules/:id
Mendapatkan detail SLA rule berdasarkan ID.

#### POST /sla-rules
Membuat SLA rule baru. (Admin only)

**Request Body:**
```json
{
  "priority_id": "uuid",
  "duration_hours": 24,
  "description": "SLA untuk prioritas tinggi",
  "is_active": true
}
```

#### PUT /sla-rules/:id
Memperbarui SLA rule. (Admin only)

#### DELETE /sla-rules/:id
Menghapus SLA rule. (Admin only)

---

### 🎫 Tickets (Tiket)

#### GET /tickets
Mendapatkan daftar semua tiket. (Admin/Staff only)

**Query Parameters:**
- `status` (string, optional): Filter berdasarkan status (open, in_progress, on_hold, resolved, closed)
- `category_id` (uuid, optional): Filter berdasarkan kategori
- `priority_id` (uuid, optional): Filter berdasarkan prioritas
- `assigned_to` (uuid, optional): Filter berdasarkan user yang ditugaskan
- `user_id` (uuid, optional): Filter berdasarkan pembuat tiket
- `search` (string, optional): Pencarian berdasarkan judul, deskripsi, atau nomor tiket
- `date_from` (date, optional): Filter dari tanggal
- `date_to` (date, optional): Filter sampai tanggal
- `page` (number, optional): Halaman (default: 1)
- `limit` (number, optional): Jumlah data per halaman (default: 10, max: 100)

#### GET /tickets/my
Mendapatkan tiket yang dibuat oleh user yang login.

#### GET /tickets/assigned
Mendapatkan tiket yang ditugaskan kepada user yang login. (Staff only)

#### GET /tickets/overdue
Mendapatkan tiket yang sudah melewati SLA deadline. (Admin/Staff only)

#### GET /tickets/stats
Mendapatkan statistik tiket. (Admin/Staff only)

#### GET /tickets/:id
Mendapatkan detail tiket berdasarkan ID.

#### GET /tickets/:id/details
Mendapatkan detail tiket dengan informasi lengkap (kategori, prioritas, SLA).

#### POST /tickets
Membuat tiket baru.

**Request Body:**
```json
{
  "category_id": "uuid",
  "priority_id": "uuid",
  "title": "Masalah printer tidak bisa print",
  "description": "Printer di lantai 3 tidak bisa print dokumen. Sudah dicoba restart tapi masih tidak bisa."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tiket berhasil dibuat",
  "data": {
    "id": "uuid",
    "ticket_number": "TKT-20250110-001",
    "user_id": "uuid",
    "assigned_to": null,
    "category_id": "uuid",
    "priority_id": "uuid",
    "title": "Masalah printer tidak bisa print",
    "description": "Printer di lantai 3 tidak bisa print dokumen...",
    "status": "open",
    "sla_deadline": "2025-01-11T00:00:00.000Z",
    "resolved_at": null,
    "closed_at": null,
    "created_at": "2025-01-10T00:00:00.000Z",
    "updated_at": "2025-01-10T00:00:00.000Z"
  }
}
```

#### PUT /tickets/:id
Memperbarui tiket.

**Request Body:**
```json
{
  "status": "in_progress",
  "title": "Masalah printer tidak bisa print - Updated",
  "description": "Printer di lantai 3 tidak bisa print dokumen. Sudah dicoba restart tapi masih tidak bisa. Update: Sudah dicoba ganti kabel USB."
}
```

#### PUT /tickets/:id/assign
Menugaskan tiket kepada staff IT. (Admin/Staff only)

**Request Body:**
```json
{
  "assigned_to": "uuid"
}
```

---

### 💬 Ticket Comments (Komentar Tiket)

#### GET /ticket-comments/ticket/:ticket_id
Mendapatkan komentar berdasarkan ID tiket.

**Query Parameters:**
- `hide_internal` (boolean, optional): Sembunyikan komentar internal (default: false)

#### GET /ticket-comments/ticket/:ticket_id/count
Mendapatkan jumlah komentar berdasarkan ID tiket.

#### GET /ticket-comments/recent
Mendapatkan komentar terbaru. (Admin/Staff only)

#### GET /ticket-comments/:id
Mendapatkan detail komentar berdasarkan ID.

#### POST /ticket-comments
Menambahkan komentar baru pada tiket.

**Request Body:**
```json
{
  "ticket_id": "uuid",
  "comment": "Sudah dicoba restart printer dan ganti kabel USB, tapi masih tidak bisa print.",
  "is_internal": false
}
```

---

### 📎 Ticket Attachments (Lampiran Tiket)

#### GET /ticket-attachments/ticket/:ticket_id
Mendapatkan lampiran berdasarkan ID tiket.

#### GET /ticket-attachments/ticket/:ticket_id/count
Mendapatkan jumlah dan total ukuran lampiran berdasarkan ID tiket.

#### GET /ticket-attachments/recent
Mendapatkan lampiran terbaru. (Admin/Staff only)

#### GET /ticket-attachments/:id
Mendapatkan detail lampiran berdasarkan ID.

#### POST /ticket-attachments/upload
Upload multiple files untuk tiket.

**Request:**
- Content-Type: `multipart/form-data`
- Files: `files` (array of files, max 5 files, max 10MB per file)

**Form Data:**
- `ticket_id` (string): ID tiket
- `description` (string, optional): Deskripsi lampiran
- `files` (file[]): File yang akan diupload

**Supported File Types:**
- Images: .jpg, .jpeg, .png, .gif, .webp
- Documents: .pdf, .doc, .docx, .xls, .xlsx, .txt, .csv
- Archives: .zip, .rar

#### POST /ticket-attachments
Membuat record lampiran baru.

#### DELETE /ticket-attachments/:id
Menghapus lampiran. (Admin/Manager only)

---

### 📊 Dashboard

#### GET /dashboard/user
Mendapatkan dashboard untuk user (requester).

**Response:**
```json
{
  "success": true,
  "message": "Dashboard user berhasil ditemukan",
  "data": {
    "summary": {
      "open": 2,
      "in_progress": 1,
      "resolved": 5,
      "closed": 3,
      "total": 11
    },
    "recent_tickets": [...],
    "monthly_stats": {
      "created_this_month": 8,
      "resolved_this_month": 6
    }
  }
}
```

#### GET /dashboard/staff
Mendapatkan dashboard untuk IT staff.

#### GET /dashboard/manager
Mendapatkan dashboard untuk manager.

#### GET /dashboard/admin
Mendapatkan dashboard untuk admin.

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error message",
  "error": "Detailed error information"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "User tidak terautentikasi"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Anda tidak memiliki izin untuk mengakses resource ini"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource tidak ditemukan"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Terjadi kesalahan pada server"
}
```

---

## Status Codes

- `open`: Tiket baru dibuat, belum ditugaskan
- `in_progress`: Tiket sedang ditangani
- `on_hold`: Tiket ditunda (menunggu informasi/part/approval)
- `resolved`: Tiket sudah selesai diperbaiki, menunggu konfirmasi user
- `closed`: Tiket sudah ditutup

## Priority Levels

- `Low` (Level 1): Prioritas rendah - dapat diselesaikan dalam beberapa hari
- `Medium` (Level 2): Prioritas sedang - harus diselesaikan dalam 1-2 hari
- `High` (Level 3): Prioritas tinggi - harus diselesaikan dalam beberapa jam
- `Critical` (Level 4): Prioritas kritis - harus diselesaikan segera

## SLA Rules

- Low: 72 jam (3 hari)
- Medium: 48 jam (2 hari)
- High: 24 jam (1 hari)
- Critical: 8 jam

---

## Usage Examples

### 1. User membuat tiket baru
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

### 2. IT Staff menugaskan tiket
```bash
curl -X PUT http://localhost:3000/api/v1/tickets/ticket-uuid/assign \
  -H "Authorization: Bearer <sso_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "assigned_to": "staff-uuid"
  }'
```

### 3. Upload lampiran
```bash
curl -X POST http://localhost:3000/api/v1/ticket-attachments/upload \
  -H "Authorization: Bearer <sso_token>" \
  -F "ticket_id=ticket-uuid" \
  -F "description=Screenshot error printer" \
  -F "files=@screenshot.png"
```

### 4. Menambahkan komentar
```bash
curl -X POST http://localhost:3000/api/v1/ticket-comments \
  -H "Authorization: Bearer <sso_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "ticket_id": "ticket-uuid",
    "comment": "Sudah dicoba restart printer dan ganti kabel USB, tapi masih tidak bisa print."
  }'
```

---

## Notes

1. **Authentication**: Semua endpoint memerlukan token SSO yang valid
2. **File Upload**: Maksimal 5 file per request, maksimal 10MB per file
3. **Pagination**: Gunakan parameter `page` dan `limit` untuk pagination
4. **Search**: Gunakan parameter `search` untuk pencarian teks
5. **Filtering**: Gunakan parameter filter yang tersedia untuk memfilter data
6. **Notifications**: Sistem akan mengirim notifikasi email otomatis untuk update tiket
7. **SLA Monitoring**: Sistem akan memantau SLA dan menandai tiket yang overdue
8. **Role-based Access**: Setiap endpoint memiliki kontrol akses berdasarkan role user
