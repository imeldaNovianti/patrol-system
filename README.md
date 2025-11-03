# 🦺 Safety Patrol & 4M Analysis System

Aplikasi web komprehensif untuk mengelola **laporan patroli keselamatan** dan **analisis 4M (Man, Machine, Method, Material)**.  
Arsitektur: Frontend React.js + Backend PHP (MySQL via phpMyAdmin)
---

## ✨ Fitur Utama

### 🔐 Autentikasi
- Sistem login sederhana (username: `imelda`, password: `imelda2323`)
- Manajemen sesi menggunakan **localStorage**
- Pengelolaan profil pengguna

### 📊 Dashboard
- Ringkasan laporan patroli keselamatan
- Statistik: total laporan, temuan, rata-rata skor, dan item berisiko tinggi
- Daftar laporan terbaru dengan akses cepat
- Indikator tingkat risiko

### 📝 Manajemen Laporan
- Membuat laporan patroli keselamatan secara lengkap
- Edit dan hapus laporan
- Pencarian dan filter laporan
- Tampilan detail laporan dengan seluruh temuan

### 📈 Analisis 4M & Grafik
- Penilaian risiko otomatis (Severity × Frequency × Likelihood)
- Perhitungan peringkat risiko (A/B/C)
- Grafik distribusi risiko dan kategori
- Analisis berdasarkan kategori masalah
- Tren skor risiko per item

### 📋 Kolom Formulir Lengkap
Setiap temuan patroli mencakup:

| Kolom | Deskripsi |
|-------|------------|
| **Before Problem** | Deskripsi masalah awal |
| **Actual Situation** | Kondisi saat ini |
| **Root Cause** | Analisis penyebab |
| **Kaizen** | Usulan perbaikan |
| **Category** | Klasifikasi masalah |
| **Risk Assessment** | Severity, Frequency, Likelihood (1–5) |
| **Control Point** | Titik kendali pemantauan |
| **Action Taken** | Solusi yang diterapkan |
| **After Result** | Hasil setelah tindakan |

---

## ⚙️ Teknologi yang Digunakan
- **Frontend:** Next.js 15 (App Router) + TypeScript  
- **Styling:** Tailwind CSS & komponen shadcn/ui  
- **Database:** SQLite dengan Prisma ORM  
- **API:** Next.js API Routes  
- **Chart:** Komponen grafik kustom  
- **Autentikasi:** Sistem kredensial sederhana  

---

## 🚀 Instalasi & Persiapan

### Prasyarat
- Node.js 18+
- npm atau yarn

### Langkah Cepat
```bash
cd safety-app
npm install
