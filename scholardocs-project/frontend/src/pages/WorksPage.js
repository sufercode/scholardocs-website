import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { GraduationCap, BookOpen, Calendar, User, FileText, Search, Filter, ArrowLeft, Download } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const WorkCard = ({ work, category, onClick }) => {
  const getTypeColor = (type) => {
    switch (type) {
      case 'skripsi': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'tesis': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'disertasi': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card 
      className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover-lift cursor-pointer transition-all duration-300"
      onClick={onClick}
      data-testid={`work-card-${work.id}`}
    >
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <Badge className={`${getTypeColor(work.type)} font-medium`}>
            {work.type.charAt(0).toUpperCase() + work.type.slice(1)}
          </Badge>
          <div className="text-sm text-gray-500 flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {work.year}
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 hover:text-teal-600 transition-colors">
            {work.title}
          </h3>
          
          <div className="flex items-center text-sm text-gray-600">
            <User className="w-4 h-4 mr-1" />
            <span>{work.author}</span>
          </div>
          
          {work.university && (
            <div className="flex items-center text-sm text-gray-600">
              <GraduationCap className="w-4 h-4 mr-1" />
              <span>{work.university}</span>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-gray-700 line-clamp-3">
            {work.abstract}
          </p>
          
          {category && (
            <Badge variant="outline" className="text-xs text-teal-700 border-teal-200">
              {category.name}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center text-sm text-teal-600">
            <FileText className="w-4 h-4 mr-1" />
            <span>Lihat Detail</span>
          </div>
          
          {work.pdf_url && (
            <Button
              size="sm"
              variant="outline"
              className="text-teal-600 border-teal-200 hover:bg-teal-50"
              onClick={(e) => {
                e.stopPropagation();
                window.open(work.pdf_url, '_blank');
              }}
              data-testid={`download-pdf-${work.id}`}
            >
              <Download className="w-4 h-4 mr-1" />
              PDF
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

const WorksPage = () => {
  const [works, setWorks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchWorks();
  }, [selectedCategory, selectedType]);

  const fetchData = async () => {
    try {
      await Promise.all([fetchCategories(), fetchWorks()]);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API}/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchWorks = async () => {
    try {
      let url = `${API}/works`;
      const params = new URLSearchParams();
      
      // Only add params if they are not empty and not the "ALL_" values
      if (selectedCategory && selectedCategory !== 'ALL_CATEGORIES') {
        params.append('category_id', selectedCategory);
      }
      if (selectedType && selectedType !== 'ALL_TYPES') {
        params.append('type', selectedType);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setWorks(data);
      }
    } catch (error) {
      console.error('Error fetching works:', error);
    }
  };

  const filteredWorks = works.filter(work => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      work.title.toLowerCase().includes(searchLower) ||
      work.author.toLowerCase().includes(searchLower) ||
      work.abstract.toLowerCase().includes(searchLower) ||
      (work.university && work.university.toLowerCase().includes(searchLower))
    );
  });

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Tidak Diketahui';
  };

  const getCategoryObj = (categoryId) => {
    return categories.find(cat => cat.id === categoryId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <div className="animate-spin w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-600">Memuat karya ilmiah...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <ArrowLeft className="w-5 h-5 text-gray-600 hover:text-teal-600 transition-colors" />
              </Link>
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-8 h-8 text-teal-600" />
                <span className="text-xl font-bold text-gray-900">ScholarDocs</span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">
                Beranda
              </Link>
              <Link to="/works" className="text-teal-600 font-medium">
                Koleksi Karya
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fadeInUp">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Galeri Karya Ilmiah</h1>
          <p className="text-xl text-gray-600">Temukan inspirasi dari {works.length} karya ilmiah terpilih berbagai bidang studi</p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Cari berdasarkan judul, penulis, atau universitas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/80 backdrop-blur-sm border-0 shadow-sm"
                  data-testid="search-input"
                />
              </div>
            </div>
            
            {/* Category Filter */}
            <Select value={selectedCategory || undefined} onValueChange={(value) => setSelectedCategory(value === 'ALL_CATEGORIES' ? '' : value)}>
              <SelectTrigger className="bg-white/80 backdrop-blur-sm border-0 shadow-sm" data-testid="category-filter">
                <SelectValue placeholder="Semua Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL_CATEGORIES">Semua Kategori</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Type Filter */}
            <Select value={selectedType || undefined} onValueChange={(value) => setSelectedType(value === 'ALL_TYPES' ? '' : value)}>
              <SelectTrigger className="bg-white/80 backdrop-blur-sm border-0 shadow-sm" data-testid="type-filter">
                <SelectValue placeholder="Semua Jenis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL_TYPES">Semua Jenis</SelectItem>
                <SelectItem value="skripsi">Skripsi</SelectItem>
                <SelectItem value="tesis">Tesis</SelectItem>
                <SelectItem value="disertasi">Disertasi</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Active Filters */}
          {(selectedCategory || selectedType || searchTerm) && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-600">Filter aktif:</span>
              
              {searchTerm && (
                <Badge 
                  variant="outline" 
                  className="text-teal-700 border-teal-200 cursor-pointer hover:bg-teal-50"
                  onClick={() => setSearchTerm('')}
                >
                  Pencarian: {searchTerm} ×
                </Badge>
              )}
              
              {selectedCategory && (
                <Badge 
                  variant="outline" 
                  className="text-teal-700 border-teal-200 cursor-pointer hover:bg-teal-50"
                  onClick={() => setSelectedCategory('')}
                >
                  {getCategoryName(selectedCategory)} ×
                </Badge>
              )}
              
              {selectedType && (
                <Badge 
                  variant="outline" 
                  className="text-teal-700 border-teal-200 cursor-pointer hover:bg-teal-50"
                  onClick={() => setSelectedType('')}
                >
                  {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} ×
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredWorks.length > 0 ? (
            filteredWorks.map((work, index) => (
              <div 
                key={work.id}
                className="animate-fadeInUp" 
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <WorkCard 
                  work={work} 
                  category={getCategoryObj(work.category_id)}
                  onClick={() => navigate(`/works/${work.id}`)}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <div className="space-y-4">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto" />
                <h3 className="text-xl font-semibold text-gray-600">Tidak ada karya ilmiah ditemukan</h3>
                <p className="text-gray-500">Coba ubah filter atau kata kunci pencarian Anda</p>
                
                {(selectedCategory || selectedType || searchTerm) && (
                  <Button 
                    variant="outline" 
                    className="mt-4 border-teal-200 text-teal-700 hover:bg-teal-50"
                    onClick={() => {
                      setSelectedCategory('');
                      setSelectedType('');
                      setSearchTerm('');
                    }}
                    data-testid="clear-filters-btn"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Hapus Semua Filter
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Load More / Pagination can be added here in future */}
        {filteredWorks.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-gray-600">
              Menampilkan {filteredWorks.length} dari {works.length} karya ilmiah
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorksPage;
