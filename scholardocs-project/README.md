# ScholarDocs - Platform Galeri Karya Ilmiah

Platform web untuk memajang dan menjelajahi koleksi karya ilmiah (skripsi, tesis, disertasi) dari berbagai bidang studi.

## 🌟 Fitur Utama

### Untuk Pengunjung
- **Galeri Karya Ilmiah**: Jelajahi koleksi karya ilmiah terpilih dari berbagai universitas
- **Filter & Pencarian**: Cari berdasarkan kategori, jenis karya, atau kata kunci
- **Detail Lengkap**: Lihat informasi lengkap setiap karya termasuk abstrak dan metadata
- **Akses PDF**: Link download langsung ke file PDF karya ilmiah
- **Responsive Design**: Optimal di desktop, tablet, dan mobile

### Kategori Tersedia
- Teknik Informatika
- Manajemen
- Psikologi
- Hukum
- Kedokteran
- Pendidikan

### Jenis Karya
- Skripsi (S1)
- Tesis (S2)
- Disertasi (S3)

## 🚀 Teknologi

- **Frontend**: React 19, Tailwind CSS, Shadcn/UI
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **Deployment**: Docker-ready

## 📁 Struktur Project

```
/app/
├── backend/                 # FastAPI server
│   ├── server.py           # Main application
│   ├── init_data.py        # Database initialization
│   └── requirements.txt    # Dependencies
├── frontend/               # React application
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # UI components
│   │   └── App.js         # Main app
│   └── package.json       # Dependencies
└── README.md              # Documentation
```

## 🎯 Penggunaan

### Untuk Pengunjung
1. Buka website di browser
2. Jelajahi homepage untuk melihat statistik dan fitur
3. Klik "Jelajahi Karya" untuk masuk ke galeri
4. Gunakan filter atau search untuk menemukan karya yang diminati
5. Klik karya untuk melihat detail lengkap
6. Download PDF jika tersedia

### Menambah Data Karya Ilmiah
Untuk menambahkan karya ilmiah baru, edit file `/app/backend/init_data.py` dan tambahkan entry baru dalam array `works`, kemudian jalankan:

```bash
cd /app/backend
python init_data.py
```

### Menambah Kategori Baru
Edit array `categories` dalam file `/app/backend/init_data.py` untuk menambah bidang studi baru.

## 🎨 Design System

- **Warna Utama**: Hijau Tosca (#14B8A6) dan Krem (#FEF3C7)
- **Font**: Manrope (professional academic look)
- **Style**: Modern, clean, professional
- **Animasi**: Smooth particles background dan micro-interactions

## 🔧 Development

### Prerequisites
- Node.js 18+
- Python 3.8+
- MongoDB

### Setup Local
1. **Backend**:
   ```bash
   cd backend
   pip install -r requirements.txt
   python init_data.py  # Initialize database
   uvicorn server:app --reload --host 0.0.0.0 --port 8001
   ```

2. **Frontend**:
   ```bash
   cd frontend
   yarn install
   yarn start
   ```

3. **Database**: Pastikan MongoDB berjalan di `mongodb://localhost:27017`

### Production Deployment
Project sudah dikonfigurasi untuk deployment dengan supervisor dan Docker.

## 📊 Data Sample

Website sudah dilengkapi dengan 6 karya ilmiah contoh dari berbagai bidang:
- Machine Learning untuk Fraud Detection (Teknik Informatika)
- Digital Marketing UMKM (Manajemen)
- Cognitive Behavioral Therapy (Psikologi)
- Restorative Justice (Hukum)
- Telemedicine (Kedokteran)
- Blended Learning (Pendidikan)

## 🎉 Showcase Features

- ✅ **No Login Required** - Akses langsung untuk semua pengunjung
- ✅ **Mobile Responsive** - Optimal di semua device
- ✅ **Fast Search** - Filter real-time tanpa reload
- ✅ **Clean Design** - Interface modern dan professional
- ✅ **Particle Animation** - Background dinamis yang menarik
- ✅ **PDF Integration** - Link langsung ke file karya ilmiah

---

**Dibuat dengan ❤️ untuk kemajuan penelitian akademik Indonesia**
