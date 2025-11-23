import asyncio
import sys
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
import uuid
from datetime import datetime, timezone

# Load environment
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

async def init_database():
    """Initialize database with sample categories and academic works"""
    
    # Connect to MongoDB
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    print("Initializing database with sample data...")
    
    # Sample categories
    categories = [
        {
            "id": str(uuid.uuid4()),
            "name": "Teknik Informatika",
            "description": "Ilmu komputer, pemrograman, dan teknologi informasi",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Manajemen",
            "description": "Administrasi bisnis, keuangan, dan manajemen strategis",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Psikologi",
            "description": "Ilmu kejiwaan, perilaku, dan kesehatan mental",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Hukum",
            "description": "Ilmu hukum, perundang-undangan, dan keadilan",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Kedokteran",
            "description": "Ilmu kesehatan, kedokteran, dan biomedis",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Pendidikan",
            "description": "Ilmu pendidikan, pembelajaran, dan pengajaran",
            "created_at": datetime.now(timezone.utc)
        }
    ]
    
    # Insert categories
    await db.categories.delete_many({})  # Clear existing
    await db.categories.insert_many(categories)
    print(f"Inserted {len(categories)} categories")
    
    # Sample academic works
    works = [
        {
            "id": str(uuid.uuid4()),
            "title": "Implementasi Machine Learning untuk Deteksi Fraud dalam Transaksi E-Commerce",
            "author": "Ahmad Rizky Pratama",
            "abstract": "Penelitian ini mengkaji implementasi algoritma machine learning untuk mendeteksi aktivitas penipuan dalam platform e-commerce. Dengan menggunakan metode Random Forest dan Neural Network, sistem dapat mengidentifikasi pola transaksi mencurigakan dengan akurasi 94.2%. Data yang digunakan meliputi 10,000 transaksi dari berbagai merchant dengan berbagai kategori produk. Hasil penelitian menunjukkan bahwa kombinasi fitur temporal dan behavioral patterns memberikan performa terbaik dalam deteksi fraud.",
            "category_id": categories[0]["id"],  # Teknik Informatika
            "year": 2024,
            "university": "Universitas Indonesia",
            "advisor": "Dr. Budi Santoso, M.Kom",
            "pdf_url": "https://example.com/sample-ml-fraud.pdf",
            "type": "skripsi",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Analisis Strategi Digital Marketing pada UMKM di Era Pandemi COVID-19",
            "author": "Sari Dewi Anggraini",
            "abstract": "Studi ini menganalisis efektivitas strategi pemasaran digital yang diterapkan oleh Usaha Mikro, Kecil, dan Menengah (UMKM) selama pandemi COVID-19. Melalui survei terhadap 150 UMKM di Jakarta dan sekitarnya, penelitian ini menemukan bahwa 78% UMKM yang menerapkan strategi digital marketing mampu mempertahankan atau bahkan meningkatkan penjualan. Platform media sosial seperti Instagram dan WhatsApp Business menjadi pilihan utama dengan tingkat konversi tertinggi.",
            "category_id": categories[1]["id"],  # Manajemen
            "year": 2023,
            "university": "Universitas Gadjah Mada",
            "advisor": "Prof. Dr. Indira Puspitasari, M.M.",
            "pdf_url": "https://example.com/sample-digital-marketing.pdf",
            "type": "tesis",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Pengaruh Terapi Cognitive Behavioral Therapy terhadap Tingkat Kecemasan Mahasiswa",
            "author": "Maya Sari Kusuma",
            "abstract": "Penelitian eksperimental ini menguji efektivitas Cognitive Behavioral Therapy (CBT) dalam menurunkan tingkat kecemasan pada mahasiswa. Subjek penelitian terdiri dari 60 mahasiswa yang mengalami kecemasan akademik. Hasil penelitian menunjukkan bahwa kelompok yang menerima terapi CBT selama 8 sesi mengalami penurunan skor kecemasan yang signifikan (p<0.05) dibandingkan kelompok kontrol. Terapi CBT terbukti efektif sebagai intervensi psikologis untuk mengatasi kecemasan mahasiswa.",
            "category_id": categories[2]["id"],  # Psikologi
            "year": 2024,
            "university": "Universitas Padjadjaran",
            "advisor": "Dr. Rina Melati, M.Psi",
            "pdf_url": "https://example.com/sample-cbt-anxiety.pdf",
            "type": "skripsi",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Implementasi Restorative Justice dalam Sistem Peradilan Pidana Anak di Indonesia",
            "author": "Bayu Aji Nugroho",
            "abstract": "Disertasi ini mengkaji implementasi konsep restorative justice dalam sistem peradilan pidana anak di Indonesia. Melalui studi komparatif dengan sistem peradilan anak di beberapa negara dan analisis kasus di 5 pengadilan negeri, penelitian ini mengidentifikasi tantangan dan peluang penerapan restorative justice. Temuan menunjukkan bahwa pendekatan restorative justice dapat mengurangi recidivism rate hingga 40% dan meningkatkan reintegrasi sosial anak pelaku tindak pidana.",
            "category_id": categories[3]["id"],  # Hukum
            "year": 2023,
            "university": "Universitas Indonesia",
            "advisor": "Prof. Dr. Sutrisno Hadi, S.H., M.H.",
            "pdf_url": "https://example.com/sample-restorative-justice.pdf",
            "type": "disertasi",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Efektivitas Telemedicine dalam Pelayanan Kesehatan Primer di Daerah Terpencil",
            "author": "Dr. Fitri Handayani",
            "abstract": "Penelitian ini mengevaluasi efektivitas implementasi telemedicine dalam meningkatkan akses pelayanan kesehatan primer di daerah terpencil. Studi dilakukan di 20 puskesmas di wilayah Indonesia Timur dengan membandingkan indikator kesehatan sebelum dan sesudah implementasi telemedicine. Hasil menunjukkan peningkatan 65% dalam deteksi dini penyakit dan 50% pengurangan rujukan ke rumah sakit. Telemedicine terbukti menjadi solusi efektif untuk mengatasi keterbatasan tenaga kesehatan di daerah terpencil.",
            "category_id": categories[4]["id"],  # Kedokteran
            "year": 2024,
            "university": "Universitas Airlangga",
            "advisor": "Prof. Dr. dr. Agus Suryanto, Sp.PD",
            "pdf_url": "https://example.com/sample-telemedicine.pdf",
            "type": "tesis",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Pengembangan Model Pembelajaran Blended Learning untuk Meningkatkan Hasil Belajar Matematika",
            "author": "Eka Prasetya Wibowo",
            "abstract": "Penelitian ini bertujuan mengembangkan model pembelajaran blended learning yang efektif untuk mata pelajaran matematika tingkat SMA. Menggunakan metode Research and Development (R&D), model dikembangkan melalui 5 tahap: analisis kebutuhan, desain, pengembangan, implementasi, dan evaluasi. Uji coba dilakukan pada 4 sekolah dengan total 240 siswa. Hasil penelitian menunjukkan bahwa model blended learning yang dikembangkan dapat meningkatkan hasil belajar matematika sebesar 23% dan motivasi belajar siswa sebesar 35%.",
            "category_id": categories[5]["id"],  # Pendidikan
            "year": 2023,
            "university": "Universitas Negeri Jakarta",
            "advisor": "Dr. Siti Nurhalimah, M.Pd",
            "pdf_url": "https://example.com/sample-blended-learning.pdf",
            "type": "skripsi",
            "created_at": datetime.now(timezone.utc)
        }
    ]
    
    # Insert academic works
    await db.academic_works.delete_many({})  # Clear existing
    await db.academic_works.insert_many(works)
    print(f"Inserted {len(works)} academic works")
    
    print("Database initialization completed successfully!")
    
    # Close connection
    client.close()

if __name__ == "__main__":
    asyncio.run(init_database())