import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { BookOpen, GraduationCap, ScrollText, Users, Search, Filter } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ParticleBackground = () => {
  return (
    <div className="particles-container">
      {[...Array(20)].map((_, i) => (
        <div key={i} className="particle" />
      ))}
    </div>
  );
};

const StatCard = ({ icon: Icon, title, value, description, delay }) => {
  return (
    <Card 
      className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover-lift animate-fadeInUp" 
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center space-x-4">
        <div className="p-3 rounded-full bg-gradient-to-br from-teal-500 to-teal-600">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm font-medium text-teal-700">{title}</p>
          <p className="text-xs text-gray-600">{description}</p>
        </div>
      </div>
    </Card>
  );
};

const FeatureCard = ({ icon: Icon, title, description, delay }) => {
  return (
    <Card 
      className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg hover-lift animate-fadeInUp group" 
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      </div>
    </Card>
  );
};

const HomePage = () => {
  const [stats, setStats] = useState({
    total_works: 0,
    total_categories: 0,
    by_type: { skripsi: 0, tesis: 0, disertasi: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API}/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      <ParticleBackground />
      
      {/* Navigation */}
      <nav className="relative z-10 bg-white/90 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-8 h-8 text-teal-600" />
              <span className="text-xl font-bold text-gray-900">ScholarDocs</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">
                Beranda
              </Link>
              <Link to="/works" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">
                Koleksi Karya
              </Link>
            </div>
            
            <Link to="/works">
              <Button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white border-0" data-testid="browse-works-btn">
                <BookOpen className="w-4 h-4 mr-2" />
                Jelajahi Karya
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fadeInLeft">
              <div className="space-y-4">
                <Badge className="bg-teal-100 text-teal-800 border-teal-200 px-3 py-1">
                  Platform Karya Ilmiah Digital
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Galeri
                  <span className="block text-transparent bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text">
                    Karya Ilmiah
                  </span>
                  Indonesia
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                  Jelajahi koleksi karya ilmiah terpilih dari berbagai bidang studi. 
                  Inspirasi dan referensi untuk penelitian akademik berkualitas.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/works">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white border-0 px-8 py-3 text-lg" 
                    data-testid="explore-works-btn"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Jelajahi Sekarang
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto border-teal-200 text-teal-700 hover:bg-teal-50 px-8 py-3 text-lg"
                >
                  <Filter className="w-5 h-5 mr-2" />
                  Filter Kategori
                </Button>
              </div>
            </div>
            
            <div className="relative animate-fadeInRight">
              <div className="relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1501503069356-3c6b82a17d89"
                  alt="Perpustakaan Universitas"
                  className="rounded-2xl shadow-2xl w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
              </div>
              
              {/* Floating stats */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{loading ? '...' : stats.total_works}</p>
                    <p className="text-sm text-gray-600">Total Karya</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-fadeInUp">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Statistik Platform</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Lihat perkembangan koleksi karya ilmiah yang terus bertambah setiap harinya
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              icon={BookOpen}
              title="Total Karya"
              value={loading ? '...' : stats.total_works}
              description="Skripsi, Tesis, Disertasi"
              delay={0}
            />
            <StatCard 
              icon={ScrollText}
              title="Skripsi"
              value={loading ? '...' : stats.by_type.skripsi}
              description="Karya tingkat sarjana"
              delay={100}
            />
            <StatCard 
              icon={GraduationCap}
              title="Tesis & Disertasi"
              value={loading ? '...' : (stats.by_type.tesis + stats.by_type.disertasi)}
              description="Karya pascasarjana"
              delay={200}
            />
            <StatCard 
              icon={Users}
              title="Kategori"
              value={loading ? '...' : stats.total_categories}
              description="Bidang studi tersedia"
              delay={300}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white/50 to-teal-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fadeInUp">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Mengapa Pilih ScholarDocs?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Platform terpercaya untuk menjelajahi dan mengakses karya ilmiah berkualitas dari seluruh Indonesia
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={BookOpen}
              title="Koleksi Terkurasi"
              description="Karya ilmiah pilihan dari berbagai universitas terkemuka dengan kualitas terjamin"
              delay={0}
            />
            <FeatureCard 
              icon={Search}
              title="Mudah Dijelajahi"
              description="Sistem pencarian dan filter yang intuitif untuk menemukan karya sesuai minat Anda"
              delay={100}
            />
            <FeatureCard 
              icon={Filter}
              title="Beragam Bidang"
              description="Dari teknik hingga sosial humaniora, temukan inspirasi dari berbagai disiplin ilmu"
              delay={200}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="p-12 bg-gradient-to-br from-teal-500 to-teal-600 border-0 text-white animate-fadeInUp">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold">Jelajahi Karya Ilmiah Terkini</h2>
              <p className="text-xl text-teal-100 max-w-2xl mx-auto">
                Temukan inspirasi dan referensi dari koleksi karya ilmiah terpilih. 
                Dari skripsi hingga disertasi, semua tersedia untuk Anda jelajahi.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/works">
                  <Button 
                    size="lg" 
                    className="bg-white text-teal-600 hover:bg-gray-50 px-8 py-3 text-lg font-semibold" 
                    data-testid="start-exploring-btn"
                  >
                    <BookOpen className="w-5 h-5 mr-2" />
                    Mulai Jelajahi
                  </Button>
                </Link>
                <Link to="/works">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-white text-white hover:bg-white/10 px-8 py-3 text-lg font-semibold"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Cari Topik
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <GraduationCap className="w-8 h-8 text-teal-400" />
                <span className="text-xl font-bold">ScholarDocs</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Platform digital untuk mengakses dan berbagi karya ilmiah berkualitas dari seluruh Indonesia.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Navigasi</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-teal-400 transition-colors">Beranda</Link></li>
                <li><Link to="/works" className="text-gray-400 hover:text-teal-400 transition-colors">Koleksi Karya</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Kontak</h3>
              <p className="text-gray-400">
                Email: info@scholardocs.id<br/>
                Platform Karya Ilmiah Indonesia
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 ScholarDocs. Semua hak cipta dilindungi undang-undang.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
