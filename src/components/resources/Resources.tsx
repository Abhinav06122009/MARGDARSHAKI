import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Download, FileText, BookOpen, Target, Code, Shield, Filter, Star, Briefcase } from 'lucide-react';
import logo from "@/components/logo/logo.png";
import { Link } from 'react-router-dom';

interface ResourcesProps {
  onBack: () => void;
}

const Resources: React.FC<ResourcesProps> = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample Public Resources (To show content to crawlers even without DB connection)
  const publicResources = [
    { id: 1, title: "Algebra Formula Sheet", category: "Math", type: "PDF", downloads: 1200 },
    { id: 2, title: "Physics: Laws of Motion", category: "Science", type: "PDF", downloads: 850 },
    { id: 3, title: "Chemical Periodic Table", category: "Chemistry", type: "Image", downloads: 2100 },
    { id: 4, title: "English Grammar Basics", category: "Language", type: "DOCX", downloads: 500 },
    { id: 5, title: "Java Programming Cheat Sheet", category: "Coding", type: "PDF", downloads: 3000 },
    { id: 6, title: "History: World War II Timeline", category: "History", type: "PDF", downloads: 600 },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div>
            <Link to="/">
                <Button variant="ghost" className="mb-4 text-white/60 hover:text-white pl-0">← Back Home</Button>
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent mb-4">
              Educational Resource Library
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl">
              Access thousands of free study materials, worksheets, and exam guides. 
              Curated by experts to help you achieve academic excellence.
            </p>
          </div>
          <div className="flex gap-3">
             <Link to="/auth">
                <Button className="bg-white text-black hover:bg-gray-200 font-semibold">Login to Upload</Button>
             </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-16">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input 
            type="text" 
            placeholder="Search for notes, formulas, or question papers..." 
            className="pl-12 py-6 bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Featured Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {[
                { name: "Mathematics", icon: Calculator, color: "text-blue-400", bg: "bg-blue-400/10" },
                { name: "Science", icon: Target, color: "text-green-400", bg: "bg-green-400/10" },
                { name: "Languages", icon: BookOpen, color: "text-purple-400", bg: "bg-purple-400/10" },
                { name: "Coding", icon: Code, color: "text-orange-400", bg: "bg-orange-400/10" },
            ].map((cat, i) => (
                <div key={i} className={`${cat.bg} border border-white/5 p-4 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-opacity-20 transition-all`}>
                    <cat.icon className={`w-6 h-6 ${cat.color}`} />
                    <span className="font-semibold">{cat.name}</span>
                </div>
            ))}
        </div>

        {/* Resource List (Mock for SEO) */}
        <div className="mb-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" /> Popular Downloads
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {publicResources.map((res) => (
                    <Card key={res.id} className="bg-white/5 border-white/10 hover:border-emerald-500/30 transition-all group">
                        <CardHeader>
                            <CardTitle className="text-white text-lg group-hover:text-emerald-400 transition-colors">{res.title}</CardTitle>
                            <div className="flex gap-2 mt-2">
                                <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-300">{res.category}</span>
                                <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-300">{res.type}</span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center text-sm text-gray-400">
                                <span>{res.downloads} downloads</span>
                                <Button size="sm" variant="ghost" className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10">
                                    <Download className="w-4 h-4 mr-2" /> Download
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>

        {/* --- SEO CONTENT SECTION (CRITICAL FOR ADSENSE) --- */}
        <div className="max-w-5xl mx-auto text-gray-400 space-y-12 border-t border-white/10 pt-16">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-white">Why Use the MARGDARSHAK Resource Library?</h2>
              <p className="text-lg max-w-3xl mx-auto">
                  We provide a centralized platform for students to access high-quality educational materials completely free of charge. 
                  Our goal is to democratize education by making study resources accessible to everyone.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                    <BookOpen className="w-10 h-10 text-blue-400 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-3">Comprehensive Notes</h3>
                    <p className="leading-relaxed text-sm">
                        Our library includes detailed chapter-wise notes for CBSE (Central Board of Secondary Education), ICSE, and various State Boards. 
                        Subjects covered include Physics, Chemistry, Mathematics (PCM), and Biology (PCB).
                    </p>
                </div>

                <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                    <FileText className="w-10 h-10 text-green-400 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-3">Exam Papers</h3>
                    <p className="leading-relaxed text-sm">
                        Prepare effectively with previous year question papers (PYQs), sample papers, and mock tests for competitive exams 
                        like JEE Mains, NEET, and CUET. Solving these helps you understand exam patterns and time management.
                    </p>
                </div>

                <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                    <Briefcase className="w-10 h-10 text-purple-400 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-3">Skill Development</h3>
                    <p className="leading-relaxed text-sm">
                        Beyond academics, explore resources for coding (Python, Java, C++), financial literacy, and communication skills. 
                        These materials are designed to prepare you for future career opportunities and internships.
                    </p>
                </div>
            </div>

            <div className="bg-gradient-to-r from-emerald-900/20 to-blue-900/20 rounded-3xl p-8 border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-4">How to Contribute</h3>
                <p className="mb-4">
                    MARGDARSHAK is a community-driven platform. If you have created high-quality notes or have access to helpful study materials, 
                    you can contribute to our library.
                </p>
                <ul className="list-disc pl-5 space-y-2 mb-6">
                    <li>Create an account or Login to your dashboard.</li>
                    <li>Navigate to the "Upload" section.</li>
                    <li>Select your file (PDF, DOCX, PPT) and add relevant tags (e.g., #Physics #Class12).</li>
                    <li>Once approved, your resource will help thousands of other students!</li>
                </ul>
                <Link to="/auth">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Join the Community</Button>
                </Link>
            </div>
        </div>

        <footer className="mt-20 py-8 border-t border-white/10 text-center text-sm text-gray-500">
            <div className="flex items-center justify-center gap-2 mb-4">
                <img src={logo} alt="MARGDARSHAK" className="w-8 h-8 opacity-80" />
                <span className="text-white font-semibold">MARGDARSHAK</span>
            </div>
            <p>Empowering Students | Developed by VSAV GYANTAPA | &copy; 2025</p>
        </footer>
      </div>
    </div>
  );
};

export default Resources;
