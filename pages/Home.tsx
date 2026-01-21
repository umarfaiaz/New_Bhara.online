
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ArrowRight, TrendingUp, DollarSign, Star, Zap, PlayCircle, ChevronDown, Sparkles, Flame, Shield, Car, Camera, Home as HomeIcon, ChevronRight, ArrowUpRight, ShieldCheck, Users, Lock, Headphones, Smartphone, LayoutGrid, Building2, Bike, Briefcase, Calendar as CalendarIcon, Music } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { CITIES } from '../constants';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('Dhaka');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/marketplace', { state: { search: searchQuery, location: locationQuery } });
  };

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-[#ff4b9a]/20">
      <style>{`
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-15px); } 100% { transform: translateY(0px); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float 7s ease-in-out infinite 2s; }
        .animate-float-slow { animation: float 8s ease-in-out infinite 1s; }
        @keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } }
        .animate-blob { animation: blob 10s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 px-4 sm:px-6 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200/40 rounded-full blur-[100px] mix-blend-multiply animate-blob"></div>
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-200/40 rounded-full blur-[100px] mix-blend-multiply animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-yellow-100/40 rounded-full blur-[100px] mix-blend-multiply animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Text Content */}
                <div className="space-y-8 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-orange-100 shadow-sm text-orange-600 text-xs font-bold uppercase tracking-wider mb-2 animate-in slide-in-from-bottom fade-in duration-700">
                        <Flame size={14} className="fill-orange-500 animate-pulse"/> #1 Rental Marketplace
                    </div>
                    
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 leading-[1.05] tracking-tight animate-in slide-in-from-bottom fade-in duration-700 delay-100">
                        Rent the <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4b9a] via-purple-600 to-indigo-600">Extraordinary.</span>
                    </h1>
                    
                    <p className="text-lg text-gray-500 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-in slide-in-from-bottom fade-in duration-700 delay-200">
                        Don't buy what you can rent. Access verified cars, cameras, and properties instantly. Save money, live better.
                    </p>

                    {/* Booking Engine Search Bar */}
                    <div className="animate-in slide-in-from-bottom fade-in duration-700 delay-300">
                        <div className="bg-white/80 backdrop-blur-xl p-3 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(45,27,78,0.15)] border border-white/50 max-w-xl mx-auto lg:mx-0 relative group hover:shadow-[0_25px_70px_-15px_rgba(255,75,154,0.2)] transition-shadow duration-300">
                            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-2">
                                <div className="flex-1 w-full sm:w-auto px-5 py-3 border-b sm:border-b-0 sm:border-r border-gray-100 text-left">
                                    <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">What</label>
                                    <input 
                                        type="text" 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Car, Camera, Flat..." 
                                        className="w-full font-bold text-gray-900 text-lg outline-none placeholder:text-gray-300 bg-transparent"
                                    />
                                </div>
                                <div className="flex-1 w-full sm:w-auto px-5 py-3 text-left">
                                    <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">Where</label>
                                    <div className="flex items-center gap-2 relative">
                                        <MapPin size={16} className="text-[#ff4b9a] flex-shrink-0"/>
                                        <select 
                                            value={locationQuery}
                                            onChange={(e) => setLocationQuery(e.target.value)}
                                            className="w-full font-bold text-gray-900 text-lg outline-none bg-transparent appearance-none cursor-pointer pr-6 relative z-10"
                                        >
                                            {CITIES.map(city => (
                                                <option key={city} value={city}>{city}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={16} className="absolute right-0 text-gray-400 pointer-events-none"/>
                                    </div>
                                </div>
                                <button type="submit" className="w-full sm:w-auto p-4 bg-[#2d1b4e] text-white rounded-[1.5rem] hover:bg-black hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 group-hover:bg-[#ff4b9a]">
                                    <Search size={24} strokeWidth={2.5}/>
                                    <span className="sm:hidden font-bold">Search</span>
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="flex items-center justify-center lg:justify-start gap-4 text-sm font-medium text-gray-500 animate-in slide-in-from-bottom fade-in duration-700 delay-500">
                        <span className="flex items-center gap-1"><Sparkles size={14} className="text-yellow-500"/> Popular:</span>
                        <div className="flex flex-wrap justify-center gap-2">
                            {['DSLR Camera', 'Sedan Car', 'Bachelor Flat'].map(tag => (
                                <span key={tag} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-600 cursor-pointer hover:border-[#ff4b9a] hover:text-[#ff4b9a] transition-colors">{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Hero Visual - Floating Cards */}
                <div className="hidden lg:block relative h-[600px] w-full animate-in fade-in duration-1000 delay-300">
                    {/* Decorative Circle */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-gray-200/50 rounded-full"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] border border-[#ff4b9a]/10 rounded-full"></div>

                    {/* Card 1: Car */}
                    <div className="absolute top-10 left-10 w-64 bg-white p-3 rounded-[1.5rem] shadow-xl animate-float z-20">
                        <div className="h-40 rounded-xl overflow-hidden mb-3 relative group">
                            <img src="https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
                            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-bold">৳4.5k</div>
                        </div>
                        <div className="px-1">
                            <h4 className="font-bold text-gray-900">Premium Sedan</h4>
                            <p className="text-xs text-gray-400">Dhaka • Instant</p>
                        </div>
                    </div>

                    {/* Card 2: Camera (Center) */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 bg-white p-4 rounded-[2rem] shadow-2xl animate-float-delayed z-30 scale-110">
                         <div className="h-48 rounded-2xl overflow-hidden mb-4 relative group">
                            <img src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
                            <div className="absolute top-3 right-3 bg-[#ff4b9a] text-white px-3 py-1 rounded-lg text-xs font-bold shadow-lg">Popular</div>
                        </div>
                        <div className="flex justify-between items-center px-1">
                            <div>
                                <h4 className="font-extrabold text-lg text-gray-900">Sony Alpha A7</h4>
                                <p className="text-xs text-gray-500 font-medium">Camera Kit</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-[#ff4b9a] transition-colors">
                                <ArrowRight size={20}/>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: House */}
                    <div className="absolute bottom-20 right-10 w-60 bg-white p-3 rounded-[1.5rem] shadow-xl animate-float-slow z-20">
                        <div className="h-32 rounded-xl overflow-hidden mb-3 relative group">
                            <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
                             <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-bold">৳22k/mo</div>
                        </div>
                        <div className="px-1">
                            <h4 className="font-bold text-gray-900">Studio Apt</h4>
                            <p className="text-xs text-gray-400">Gulshan • Furnished</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* 2. COMPACT CATEGORIES GRID */}
      <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col items-start mb-10 gap-6">
                  <div>
                      <h2 className="text-3xl font-black text-gray-900 tracking-tight">Browse by Category</h2>
                      <p className="text-gray-500 mt-2">Jump directly to what you are looking for.</p>
                  </div>
                  <button onClick={() => navigate('/marketplace')} className="text-sm font-bold text-[#ff4b9a] flex items-center gap-1 hover:gap-2 transition-all bg-gray-50 px-5 py-2.5 rounded-full hover:bg-gray-100">
                      View All <ArrowRight size={16}/>
                  </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[
                      { id: 'Real Estate', name: 'Apartments', count: '450+', icon: HomeIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
                      { id: 'Vehicles', name: 'Cars', count: '120+', icon: Car, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                      { id: 'Tech', name: 'Cameras & Gear', count: '300+', icon: Camera, color: 'text-purple-600', bg: 'bg-purple-50' },
                      { id: 'Vehicles', name: 'Motorbikes', count: '80+', icon: Bike, color: 'text-orange-600', bg: 'bg-orange-50' },
                      { id: 'Real Estate', name: 'Commercial', count: '50+', icon: Building2, color: 'text-cyan-600', bg: 'bg-cyan-50' },
                      { id: 'Services', name: 'Events & Venues', count: '30+', icon: CalendarIcon, color: 'text-pink-600', bg: 'bg-pink-50' },
                      { id: 'Services', name: 'Professionals', count: '200+', icon: Briefcase, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                      { id: 'Tech', name: 'Audio & Music', count: '150+', icon: Music, color: 'text-red-600', bg: 'bg-red-50' },
                  ].map((cat, i) => (
                      <div 
                        key={i} 
                        onClick={() => navigate('/marketplace', { state: { category: cat.id } })} 
                        className="group flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-white hover:border-[#ff4b9a]/30 hover:shadow-lg transition-all duration-300 cursor-pointer"
                      >
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${cat.bg} ${cat.color} group-hover:scale-110 transition-transform`}>
                              <cat.icon size={22} strokeWidth={2.5}/>
                          </div>
                          <div>
                              <h3 className="font-bold text-gray-900 group-hover:text-[#ff4b9a] transition-colors">{cat.name}</h3>
                              <p className="text-xs text-gray-500 font-medium">{cat.count} listings</p>
                          </div>
                          <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
                              <ChevronRight size={16} className="text-gray-300"/>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* 3. NEW USP SECTION: Why Bhara.online? */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-2xl mx-auto mb-16">
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-4">Why choose Bhara<span className="text-[#ff4b9a]">.</span>online?</h2>
                  <p className="text-gray-500 text-lg">We are building the most trusted rental marketplace in Bangladesh.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                      { icon: ShieldCheck, title: "Verified Assets", desc: "Every car, flat, and gadget is verified for your safety.", color: "text-green-500", bg: "bg-green-50" },
                      { icon: Zap, title: "Instant Booking", desc: "Skip the negotiation. Book instantly and get moving.", color: "text-yellow-500", bg: "bg-yellow-50" },
                      { icon: Lock, title: "Secure Payment", desc: "Your money is held safely until you receive the asset.", color: "text-blue-500", bg: "bg-blue-50" },
                      { icon: Headphones, title: "24/7 Support", desc: "Real humans are here to help you anytime, day or night.", color: "text-[#ff4b9a]", bg: "bg-pink-50" }
                  ].map((item, i) => (
                      <div key={i} className="group p-6 rounded-[2rem] bg-white border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-default">
                          <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                              <item.icon size={28} className={item.color} strokeWidth={2}/>
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                          <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* 4. SUPPLY SIDE: Start Earning (Redesigned) */}
      <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto bg-gradient-to-br from-[#1a1a1a] to-[#2d1b4e] rounded-[3rem] p-8 md:p-20 relative overflow-hidden flex flex-col items-center justify-center text-center shadow-2xl">
              {/* Animated Glows */}
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#ff4b9a]/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>
              
              {/* Floating Icons */}
              <div className="absolute left-10 md:left-20 top-20 animate-float hidden md:block opacity-20"><Car size={64} className="text-white"/></div>
              <div className="absolute right-10 md:right-20 bottom-20 animate-float-delayed hidden md:block opacity-20"><Camera size={64} className="text-white"/></div>
              <div className="absolute top-10 right-32 animate-float-slow hidden md:block opacity-20"><HomeIcon size={48} className="text-white"/></div>

              <div className="relative z-10 max-w-3xl mx-auto">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#ff4b9a] text-xs font-bold uppercase tracking-wider mb-8 backdrop-blur-md">
                      <Sparkles size={14} className="fill-[#ff4b9a]"/> Monetize Your Assets
                  </div>
                  
                  <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight tracking-tight">
                      Turn your idle assets into <br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4b9a] to-orange-400">Monthly Income.</span>
                  </h2>
                  
                  <p className="text-lg md:text-xl text-gray-300 mb-12 leading-relaxed max-w-2xl mx-auto">
                      Have a car, camera, or empty flat? List it on Bhara.online in seconds and start earning monthly income securely.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-5 justify-center">
                      <button onClick={() => navigate('/myspace/inventory/select-type')} className="bg-[#ff4b9a] text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-[0_10px_40px_-10px_rgba(255,75,154,0.5)] hover:bg-pink-600 hover:scale-105 transition-all active:scale-95 flex items-center justify-center gap-2">
                          List Item Now <ArrowRight size={20}/>
                      </button>
                      <button className="bg-white/10 border border-white/10 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/20 hover:scale-105 transition-all flex items-center gap-2 justify-center backdrop-blur-md">
                          <PlayCircle size={20}/> How it works
                      </button>
                  </div>
              </div>
          </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
          <div className="max-w-7xl mx-auto px-6 text-center">
              <div className="mb-8 flex justify-center">
                  <div className="flex items-center gap-2 text-2xl font-black text-gray-900">
                      <div className="w-8 h-8 bg-[#ff4b9a] rounded-lg flex items-center justify-center text-white">B</div>
                      Bhara<span className="text-[#ff4b9a]">.</span>online
                  </div>
              </div>
              
              <div className="flex flex-wrap justify-center gap-8 text-sm font-bold text-gray-500 mb-12">
                  <span className="cursor-pointer hover:text-gray-900 transition-colors">Marketplace</span>
                  <span className="cursor-pointer hover:text-gray-900 transition-colors">List Item</span>
                  <span className="cursor-pointer hover:text-gray-900 transition-colors">Trust & Safety</span>
                  <span className="cursor-pointer hover:text-gray-900 transition-colors">Support</span>
                  <span className="cursor-pointer hover:text-gray-900 transition-colors">Terms</span>
              </div>

              <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400 font-medium">
                  <p>&copy; 2026 Bhara.online Inc. All rights reserved.</p>
                  <div className="flex gap-4">
                      <span>Privacy</span>
                      <span>Cookies</span>
                      <span>Sitemap</span>
                  </div>
              </div>
          </div>
      </footer>
    </div>
  );
};

export default Home;
