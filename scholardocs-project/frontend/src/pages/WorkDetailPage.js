import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { 
  GraduationCap, 
  ArrowLeft, 
  Calendar, 
  User, 
  School, 
  FileText, 
  Download, 
  ExternalLink,
  BookOpen,
  Award,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const WorkDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [work, setWork] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedWorks, setRelatedWorks] = useState([]);

  useEffect(() => {
    if (id) {
      fetchWorkDetail();
    }
  }, [id]);

  const fetchWorkDetail = async () => {
    try {
      setLoading(true);
      
      // Fetch work detail
      const workResponse = await fetch(`${API}/works/${id}`);
      if (!workResponse.ok) {
        throw new Error('Work not found');
      }
      
      const workData = await workResponse.json();
      setWork(workData);
      
      // Fetch category
      if (workData.category_id) {
        const categoriesResponse = await fetch(`${API}/categories`);
        if (categoriesResponse.ok) {
          const categories = await categoriesResponse.json();
          const workCategory = categories.find(cat => cat.id === workData.category_id);
          setCategory(workCategory);
          
          // Fetch related works (same category, exclude current)
          const relatedResponse = await fetch(`${API}/works?category_id=${workData.category_id}`);
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json();
            const filtered = relatedData.filter(w => w.id !== workData.id).slice(0, 3);
            setRelatedWorks(filtered);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching work detail:', error);
      toast.error('Gagal memuat detail karya ilmiah');
      navigate('/works');
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'skripsi': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'tesis': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'disertasi': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'skripsi': return BookOpen;
      case 'tesis': return Award;
      case 'disertasi': return GraduationCap;
      default: return FileText;
    }
  };

  const handleDownloadPDF = () => {
    if (work?.pdf_url) {
      window.open(work.pdf_url, '_blank');
      toast.success('Membuka file PDF...');
    } else {
      toast.error('File PDF tidak tersedia');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <div className="animate-spin w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-600">Memuat detail karya ilmiah...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!work) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <FileText className="w-16 h-16 text-gray-300 mx-auto" />
          <h2 className="text-2xl font-semibold text-gray-600">Karya ilmiah tidak ditemukan</h2>
          <p className="text-gray-500">Karya ilmiah yang Anda cari tidak tersedia</p>
          <Link to="/works">
            <Button className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Daftar
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const TypeIcon = getTypeIcon(work.type);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/works" className="flex items-center space-x-2 text-gray-600 hover:text-teal-600 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Kembali</span>
              </Link>
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-8 h-8 text-teal-600" />
                <span className="text-xl font-bold text-gray-900">ScholarDocs</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content */}
        <div className="space-y-8">
          {/* Header */}
          <div className="animate-fadeInUp">
            <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <div className="space-y-6">
                {/* Type and Category */}
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className={`${getTypeColor(work.type)} font-medium px-3 py-1`}>
                    <TypeIcon className="w-4 h-4 mr-1" />
                    {work.type.charAt(0).toUpperCase() + work.type.slice(1)}
                  </Badge>
                  
                  {category && (
                    <Badge variant="outline" className="text-teal-700 border-teal-200 px-3 py-1">
                      {category.name}
                    </Badge>
                  )}
                  
                  <div className="flex items-center text-sm text-gray-500 ml-auto">
                    <Calendar className="w-4 h-4 mr-1" />
                    {work.year}
                  </div>
                </div>
                
                {/* Title */}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-2" data-testid="work-title">
                    {work.title}
                  </h1>
                </div>
                
                {/* Author & University */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-700">
                    <User className="w-5 h-5 mr-2 text-teal-600" />
                    <div>
                      <p className="font-medium">Penulis</p>
                      <p className="text-sm" data-testid="work-author">{work.author}</p>
                    </div>
                  </div>
                  
                  {work.university && (
                    <div className="flex items-center text-gray-700">
                      <School className="w-5 h-5 mr-2 text-teal-600" />
                      <div>
                        <p className="font-medium">Universitas</p>
                        <p className="text-sm">{work.university}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {work.advisor && (
                  <div className="flex items-center text-gray-700">
                    <GraduationCap className="w-5 h-5 mr-2 text-teal-600" />
                    <div>
                      <p className="font-medium">Pembimbing</p>
                      <p className="text-sm">{work.advisor}</p>
                    </div>
                  </div>
                )}
                
                {/* Download Button */}
                <div className="pt-4">
                  {work.pdf_url ? (
                    <Button 
                      onClick={handleDownloadPDF}
                      className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-6 py-3"
                      data-testid="download-pdf-btn"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download PDF
                    </Button>
                  ) : (
                    <Button 
                      disabled
                      variant="outline"
                      className="text-gray-500 border-gray-200"
                    >
                      <FileText className="w-5 h-5 mr-2" />
                      PDF Tidak Tersedia
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>
          
          {/* Abstract */}
          <div className="animate-fadeInUp" style={{ animationDelay: '200ms' }}>
            <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                  <FileText className="w-6 h-6 mr-2 text-teal-600" />
                  Abstrak
                </h2>
                <Separator />
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed text-justify" data-testid="work-abstract">
                    {work.abstract}
                  </p>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Metadata */}
          <div className="animate-fadeInUp" style={{ animationDelay: '400ms' }}>
            <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">Informasi Detail</h2>
                <Separator />
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Jenis Karya</p>
                      <p className="text-lg text-gray-900 capitalize">{work.type}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Tahun</p>
                      <p className="text-lg text-gray-900">{work.year}</p>
                    </div>
                    
                    {category && (
                      <div>
                        <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Kategori</p>
                        <p className="text-lg text-gray-900">{category.name}</p>
                        {category.description && (
                          <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Penulis</p>
                      <p className="text-lg text-gray-900">{work.author}</p>
                    </div>
                    
                    {work.university && (
                      <div>
                        <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Institusi</p>
                        <p className="text-lg text-gray-900">{work.university}</p>
                      </div>
                    )}
                    
                    {work.advisor && (
                      <div>
                        <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Pembimbing</p>
                        <p className="text-lg text-gray-900">{work.advisor}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Related Works */}
          {relatedWorks.length > 0 && (
            <div className="animate-fadeInUp" style={{ animationDelay: '600ms' }}>
              <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Karya Terkait</h2>
                    <p className="text-gray-600">Karya ilmiah lain dalam kategori yang sama</p>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid gap-4">
                    {relatedWorks.map((relatedWork) => (
                      <div 
                        key={relatedWork.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => navigate(`/works/${relatedWork.id}`)}
                        data-testid={`related-work-${relatedWork.id}`}
                      >
                        <div className="flex-1 space-y-1">
                          <h3 className="font-medium text-gray-900 line-clamp-1">{relatedWork.title}</h3>
                          <p className="text-sm text-gray-600">{relatedWork.author} • {relatedWork.year}</p>
                          <Badge className={`${getTypeColor(relatedWork.type)} text-xs`}>
                            {relatedWork.type.charAt(0).toUpperCase() + relatedWork.type.slice(1)}
                          </Badge>
                        </div>
                        
                        <ExternalLink className="w-5 h-5 text-gray-400" />
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-center">
                    <Link to={`/works?category_id=${work.category_id}`}>
                      <Button variant="outline" className="border-teal-200 text-teal-700 hover:bg-teal-50">
                        Lihat Semua Karya dalam Kategori Ini
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          )}
          
          {/* Back to List */}
          <div className="text-center animate-fadeInUp" style={{ animationDelay: '800ms' }}>
            <Link to="/works">
              <Button variant="outline" className="border-teal-200 text-teal-700 hover:bg-teal-50 px-8 py-3">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Kembali ke Daftar Karya
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkDetailPage;
