# E-Loan BP Tapera

Sistem E-Loan terintegrasi dengan BP Tapera untuk pengelolaan pembiayaan perumahan (KPR, KBR, KRR).

## Tech Stack

- **Backend**: Node.js, Express.js, Sequelize ORM, MySQL
- **Frontend**: Vue.js 3, Vite, Vue Router, Pinia, Axios
- **Integrasi**: BP Tapera API (OAuth 2.0 + HMAC-SHA256)

## Fitur

1. **Pengajuan Pembiayaan** - Submit dan kelola pengajuan KPR/KBR/KRR
2. **Follow Up** - Tracking status pengajuan
3. **SP3K** - Surat Persetujuan Prinsip Kredit
4. **Verifikasi Kelayakan** - Verifikasi layak huni/bangun/renovasi
5. **Akad** - Pengelolaan akad kredit
6. **Pencairan** - Pengajuan pencairan Tapera & FLPP
7. **Laporan** - Laporan outstanding & pelunasan dipercepat
8. **Efek** - Pengelolaan efek/surat berharga
9. **Jadwal Angsuran** - Jadwal angsuran FLPP (75:25, 90:10)
10. **Pengelolaan PIC** - Manajemen PIC dengan zona
11. **Stok Rumah** - Browse perumahan & unit rumah
12. **Parameter** - Referensi data (produk, lokasi, error code, dll)
13. **Pengajuan Prioritas** - Pengelolaan pengajuan prioritas
14. **Cabang** - Manajemen cabang bank

## Instalasi

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env sesuai konfigurasi database & BP Tapera
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Konfigurasi

### Environment Variables (Backend)

| Variable | Deskripsi |
|----------|-----------|
| PORT | Port server (default: 3000) |
| DB_HOST | MySQL host |
| DB_NAME | Nama database |
| DB_USER | MySQL username |
| DB_PASS | MySQL password |
| JWT_SECRET | Secret key untuk JWT |
| TAPERA_BASE_URL | Base URL API BP Tapera |
| TAPERA_CLIENT_ID | Client ID mitra |
| TAPERA_CLIENT_SECRET | Client Secret mitra |
| TAPERA_KODE_MITRA | Kode mitra bank |

### Integrasi BP Tapera

Sistem menggunakan autentikasi HMAC-SHA256 untuk komunikasi dengan API BP Tapera:
- **OAuth 2.0**: Token management otomatis dengan refresh
- **Signature**: HMAC-SHA256 dari `path + verb + token + timestamp + body`
- **Headers**: Kode-Mitra, Cabang-Mitra, PIC-Mitra, Token-Mitra, Signature-Mitra, Timestamp-Mitra, Channel-Mitra

### Environment BP Tapera

| Environment | Base URL |
|-------------|----------|
| Development | https://apidev.tapera.go.id:8443 |
| Staging | https://apiqa.tapera.go.id |
| Production | https://api.tapera.go.id |

## Struktur Project

```
eloan-bp-tapera/
├── backend/
│   ├── src/
│   │   ├── app.js              # Entry point
│   │   ├── config/             # Database, logger config
│   │   ├── controllers/        # Route handlers (14 modules)
│   │   ├── middleware/          # Auth, validation, audit log
│   │   ├── models/             # Sequelize models (15 tables)
│   │   ├── routes/             # Express routes
│   │   └── services/           # BP Tapera API client
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── views/              # Vue pages (16 views)
│   │   ├── components/         # Layout component
│   │   ├── router/             # Vue Router config
│   │   ├── stores/             # Pinia stores
│   │   ├── services/           # API client (Axios)
│   │   └── assets/             # CSS styles
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Referensi

- TSD Mitra Penyalur BP Tapera v0.8.5 (10 Desember 2025)
