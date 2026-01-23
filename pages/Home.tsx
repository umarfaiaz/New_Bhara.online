
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ArrowRight, TrendingUp, DollarSign, Star, Zap, PlayCircle, ChevronDown, Sparkles, Flame, Shield, Car, Camera, Home as HomeIcon, ChevronRight, ArrowUpRight, ShieldCheck, Users, Lock, Headphones, Smartphone, LayoutGrid, Building2, Bike, Briefcase, Calendar as CalendarIcon, Music, Wrench, Armchair, Monitor, Store, Hammer, BarChart3, Receipt, FileText } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { CITIES } from '../constants';
import { Logo } from '../components/Logo';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('Dhaka');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/marketplace', { state: { search: searchQuery, location: locationQuery } });
  };

  const navToMarket = (category: string) => navigate('/marketplace', { state: { category } });
  const navToList = () => navigate('/myspace/assets/select-type');

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
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-32 px-4 sm:px-6 overflow-hidden">
        {/* Backgrounds */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <div className="absolute top-0 left-1/4 w-72 h-72 lg:w-96 lg:h-96 bg-purple-200/40 rounded-full blur-[80px] lg:blur-[100px] mix-blend-multiply animate-blob"></div>
            <div className="absolute top-0 right-1/4 w-72 h-72 lg:w-96 lg:h-96 bg-pink-200/40 rounded-full blur-[80px] lg:blur-[100px] mix-blend-multiply animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-32 left-1/3 w-72 h-72 lg:w-96 lg:h-96 bg-yellow-100/40 rounded-full blur-[80px] lg:blur-[100px] mix-blend-multiply animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* Text Content */}
                <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 lg:px-4 lg:py-2 rounded-full bg-white border border-orange-100 shadow-sm text-orange-600 text-[10px] lg:text-xs font-bold uppercase tracking-wider mb-2 animate-in slide-in-from-bottom fade-in duration-700">
                        <Flame size={14} className="fill-orange-500 animate-pulse"/> {t('home_hero_badge')}
                    </div>
                    
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight animate-in slide-in-from-bottom fade-in duration-700 delay-100">
                        {t('home_hero_title_1')} <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4b9a] via-purple-600 to-indigo-600">{t('home_hero_title_2')}</span>
                    </h1>
                    
                    <p className="text-base lg:text-lg text-gray-500 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-in slide-in-from-bottom fade-in duration-700 delay-200">
                        {t('home_hero_subtitle')}
                    </p>

                    {/* Booking Engine Search Bar */}
                    <div className="animate-in slide-in-from-bottom fade-in duration-700 delay-300 w-full">
                        <div className="bg-white/80 backdrop-blur-xl p-2 lg:p-3 rounded-[1.5rem] lg:rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(45,27,78,0.15)] border border-white/50 max-w-md lg:max-w-xl mx-auto lg:mx-0 relative group hover:shadow-[0_25px_70px_-15px_rgba(255,75,154,0.2)] transition-shadow duration-300">
                            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-2">
                                <div className="flex-1 w-full sm:w-auto px-4 py-2 lg:px-5 lg:py-3 border-b sm:border-b-0 sm:border-r border-gray-100 text-left">
                                    <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">{t('home_search_what')}</label>
                                    <input 
                                        type="text" 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder={t('home_search_what_placeholder')} 
                                        className="w-full font-bold text-gray-900 text-base lg:text-lg outline-none placeholder:text-gray-300 bg-transparent"
                                    />
                                </div>
                                <div className="flex-1 w-full sm:w-auto px-4 py-2 lg:px-5 lg:py-3 text-left">
                                    <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">{t('home_search_where')}</label>
                                    <div className="flex items-center gap-2 relative">
                                        <MapPin size={16} className="text-[#ff4b9a] flex-shrink-0"/>
                                        <select 
                                            value={locationQuery}
                                            onChange={(e) => setLocationQuery(e.target.value)}
                                            className="w-full font-bold text-gray-900 text-base lg:text-lg outline-none bg-transparent appearance-none cursor-pointer pr-6 relative z-10 truncate"
                                        >
                                            {CITIES.map(city => (
                                                <option key={city} value={city}>{city}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={16} className="absolute right-0 text-gray-400 pointer-events-none"/>
                                    </div>
                                </div>
                                <button type="submit" className="w-full sm:w-auto p-3 lg:p-4 bg-[#2d1b4e] text-white rounded-[1rem] lg:rounded-[1.5rem] hover:bg-black hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 group-hover:bg-[#ff4b9a]">
                                    <Search size={20} strokeWidth={2.5}/>
                                    <span className="sm:hidden font-bold">{t('home_search_btn')}</span>
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="flex items-center justify-center lg:justify-start gap-4 text-sm font-medium text-gray-500 animate-in slide-in-from-bottom fade-in duration-700 delay-500">
                        <span className="flex items-center gap-1 hidden sm:flex"><Sparkles size={14} className="text-yellow-500"/> {t('home_popular')}</span>
                        <div className="flex flex-wrap justify-center gap-2">
                            {['DSLR Camera', 'Sedan Car', 'Bachelor Flat'].map(tag => (
                                <button onClick={() => navigate('/marketplace', { state: { search: tag } })} key={tag} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-600 cursor-pointer hover:border-[#ff4b9a] hover:text-[#ff4b9a] transition-colors">{tag}</button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Hero Visual - Floating Cards (Desktop Only for Layout stability) */}
                <div className="hidden lg:block relative h-[600px] w-full animate-in fade-in duration-1000 delay-300">
                    {/* Decorative Circle */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-gray-200/50 rounded-full"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] border border-[#ff4b9a]/10 rounded-full"></div>

                    {/* Card 1: Car */}
                    <div className="absolute top-10 left-10 w-64 bg-white p-3 rounded-[1.5rem] shadow-xl animate-float z-20 hover:scale-105 transition-transform cursor-pointer" onClick={() => navigate('/marketplace', { state: { category: 'Vehicles' } })}>
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
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 bg-white p-4 rounded-[2rem] shadow-2xl animate-float-delayed z-30 scale-110 hover:scale-110 transition-transform cursor-pointer" onClick={() => navigate('/marketplace', { state: { category: 'Tech' } })}>
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
                    <div className="absolute bottom-20 right-10 w-60 bg-white p-3 rounded-[1.5rem] shadow-xl animate-float-slow z-20 hover:scale-105 transition-transform cursor-pointer" onClick={() => navigate('/marketplace', { state: { category: 'Real Estate' } })}>
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

      {/* 2. MY SPACE PROMO SECTION */}
      <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-3xl mx-auto mb-16">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2d1b4e]/5 border border-[#2d1b4e]/10 text-[#2d1b4e] text-xs font-bold uppercase tracking-wider mb-4">
                      <LayoutGrid size={14}/> Introducing My Space
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-4">
                      One Dashboard to <br/> <span className="text-[#ff4b9a]">Manage Everything.</span>
                  </h2>
                  <p className="text-lg text-gray-500 font-medium">
                      Whether you own assets or rent them, My Space gives you powerful tools to handle payments, agreements, and tracking effortlessly.
                  </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                  {/* FOR OWNERS */}
                  <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-gray-100 relative overflow-hidden group hover:border-[#ff4b9a]/30 transition-all">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
                      <div className="relative z-10">
                          <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                              <Building2 size={28}/>
                          </div>
                          <h3 className="text-2xl font-black text-gray-900 mb-2">For Asset Owners</h3>
                          <p className="text-gray-500 mb-8 max-w-sm">Stop chasing payments. Automate rent collection, track vacancies, and manage maintenance requests in one place.</p>
                          
                          <ul className="space-y-4 mb-8">
                              {[
                                  { icon: BarChart3, text: "Track Income & Expenses" },
                                  { icon: Users, text: "Manage Tenant Database" },
                                  { icon: Receipt, text: "Automated Invoicing & SMS" },
                                  { icon: Wrench, text: "Handle Maintenance Issues" }
                              ].map((item, i) => (
                                  <li key={i} className="flex items-center gap-3 text-sm font-bold text-gray-700">
                                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-purple-600"><item.icon size={16}/></div>
                                      {item.text}
                                  </li>
                              ))}
                          </ul>
                          
                          <button onClick={() => navigate('/myspace/rentals')} className="w-full py-4 bg-[#2d1b4e] text-white rounded-2xl font-bold shadow-lg hover:bg-[#3a2366] active:scale-95 transition-all flex items-center justify-center gap-2">
                              Manage My Assets <ArrowRight size={18}/>
                          </button>
                      </div>
                  </div>

                  {/* FOR RENTERS */}
                  <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-gray-100 relative overflow-hidden group hover:border-blue-200 transition-all">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
                      <div className="relative z-10">
                          <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                              <HomeIcon size={28}/>
                          </div>
                          <h3 className="text-2xl font-black text-gray-900 mb-2">For Renters</h3>
                          <p className="text-gray-500 mb-8 max-w-sm">Live hassle-free. Pay rent online, request repairs instantly, and keep digital records of your agreements.</p>
                          
                          <ul className="space-y-4 mb-8">
                              {[
                                  { icon: Zap, text: "One-Tap Rent Payment" },
                                  { icon: FileText, text: "Digital Rental Agreements" },
                                  { icon: Wrench, text: "Instant Maintenance Requests" },
                                  { icon: ShieldCheck, text: "Payment History & Receipts" }
                              ].map((item, i) => (
                                  <li key={i} className="flex items-center gap-3 text-sm font-bold text-gray-700">
                                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-blue-600"><item.icon size={16}/></div>
                                      {item.text}
                                  </li>
                              ))}
                          </ul>
                          
                          <button onClick={() => navigate('/myspace/my-rental')} className="w-full py-4 bg-white border-2 border-[#2d1b4e] text-[#2d1b4e] rounded-2xl font-bold hover:bg-[#2d1b4e] hover:text-white active:scale-95 transition-all flex items-center justify-center gap-2">
                              Go to My Dashboard <ArrowRight size={18}/>
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* 3. CATEGORIES (BENTO GRID) */}
      <section className="py-20 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
              <div className="flex justify-between items-end mb-10">
                  <div>
                      <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-tight">
                          {t('home_cats_title')} <span className="text-[#ff4b9a]">{t('home_cats_title_span')}</span>
                      </h2>
                      <p className="text-lg text-gray-500 mt-2 font-medium">{t('home_cats_subtitle')}</p>
                  </div>
                  <button onClick={() => navigate('/marketplace')} className="hidden md:flex items-center gap-2 text-sm font-bold text-gray-900 hover:text-[#ff4b9a] transition-colors group">
                      {t('home_view_all_cats')} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                  </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[180px]">
                  {/* ... (Existing Bento Grid Items Unchanged) ... */}
                  {/* 1. Real Estate (Large) */}
                  <div 
                    onClick={() => navToMarket('Real Estate')}
                    className="col-span-2 md:col-span-2 row-span-2 relative rounded-[2.5rem] p-8 overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white"
                  >
                      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-white/20"></div>
                      <div className="relative z-10 h-full flex flex-col justify-between">
                          <div>
                              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-4 border border-white/10">
                                  <HomeIcon size={14}/> 450+ Properties
                              </div>
                              <h3 className="text-2xl md:text-3xl font-black leading-tight mb-2">Real Estate</h3>
                              <p className="text-blue-100 font-medium max-w-xs text-sm md:text-base">Apartments, Shared Flats, and Vacation Homes.</p>
                          </div>
                          <div className="flex items-center gap-3">
                              <span className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                  <ArrowUpRight size={20} className="md:w-6 md:h-6"/>
                              </span>
                              <span className="font-bold text-sm tracking-wide opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 hidden md:block">Browse Now</span>
                          </div>
                      </div>
                      <HomeIcon className="absolute -bottom-4 -right-4 w-32 h-32 md:w-48 md:h-48 text-white/10 rotate-[-10deg] group-hover:rotate-0 transition-transform duration-500"/>
                  </div>

                  {/* 2. Vehicles (Large Vertical) */}
                  <div 
                    onClick={() => navToMarket('Vehicles')}
                    className="col-span-1 md:col-span-1 row-span-2 relative rounded-[2.5rem] p-6 md:p-8 overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-2xl hover:shadow-orange-900/20 bg-gradient-to-br from-orange-500 to-red-600 text-white"
                  >
                      <div className="relative z-10 h-full flex flex-col justify-between">
                          <div>
                              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-4 border border-white/10">
                                  <Car size={14}/> 180+ Rides
                              </div>
                              <h3 className="text-xl md:text-2xl font-black mb-1">Vehicles</h3>
                              <p className="text-orange-100 text-xs md:text-sm font-medium">Cars, Bikes & Vans.</p>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-white text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <ArrowRight size={20}/>
                          </div>
                      </div>
                      <Car className="absolute bottom-8 -right-8 w-32 h-32 md:w-40 md:h-40 text-white/10 group-hover:scale-110 transition-transform duration-500"/>
                  </div>

                  {/* 3. Tech (Standard) */}
                  <div 
                    onClick={() => navToMarket('Tech')}
                    className="relative rounded-[2rem] p-5 md:p-6 overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-xl hover:shadow-purple-900/20 bg-gray-50 hover:bg-white border border-gray-100 hover:border-purple-100"
                  >
                      <div className="relative z-10">
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                              <Camera size={20} className="md:w-6 md:h-6"/>
                          </div>
                          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">Gadgets</h3>
                          <p className="text-[10px] md:text-xs text-gray-500 font-bold">Cameras, Drones & Lenses</p>
                      </div>
                  </div>

                  {/* 4. Commercial (Standard) */}
                  <div 
                    onClick={() => navToMarket('Commercial')}
                    className="relative rounded-[2rem] p-5 md:p-6 overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-xl hover:shadow-indigo-900/20 bg-gray-50 hover:bg-white border border-gray-100 hover:border-indigo-100"
                  >
                      <div className="relative z-10">
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                              <Store size={20} className="md:w-6 md:h-6"/>
                          </div>
                          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">Commercial</h3>
                          <p className="text-[10px] md:text-xs text-gray-500 font-bold">Offices & Shops</p>
                      </div>
                  </div>

                  {/* 5. Services (Wide) */}
                  <div 
                    onClick={() => navToMarket('Services')}
                    className="col-span-2 md:col-span-2 relative rounded-[2rem] p-5 md:p-6 overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-xl hover:shadow-pink-900/20 bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-100 hover:border-pink-200"
                  >
                      <div className="flex items-center justify-between relative z-10 h-full">
                          <div>
                              <h3 className="text-lg md:text-xl font-black text-gray-900 mb-1">Services & Events</h3>
                              <p className="text-xs md:text-sm text-gray-500 font-medium">Venues, Decorators & More.</p>
                          </div>
                          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white text-pink-500 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Sparkles size={24} className="md:w-7 md:h-7"/>
                          </div>
                      </div>
                  </div>
                  
                  {/* 6. Skills (Standard) */}
                  <div 
                    onClick={() => navToMarket('Skills')}
                    className="col-span-2 md:col-span-1 relative rounded-[2rem] p-5 md:p-6 overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-xl hover:shadow-teal-900/20 bg-gray-50 hover:bg-white border border-gray-100 hover:border-teal-100"
                  >
                      <div className="relative z-10 flex md:block items-center gap-4">
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center mb-0 md:mb-4 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                              <Hammer size={20} className="md:w-6 md:h-6"/>
                          </div>
                          <div>
                              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">Expert Skills</h3>
                              <p className="text-[10px] md:text-xs text-gray-500 font-bold">Tutors, Technicians</p>
                          </div>
                      </div>
                  </div>

              </div>
              
              <button onClick={() => navigate('/marketplace')} className="md:hidden w-full mt-6 py-4 bg-gray-100 text-gray-900 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
                  {t('home_view_all_cats')} <ArrowRight size={16}/>
              </button>
          </div>
      </section>

      {/* 4. WHY CHOOSE US SECTION (REDESIGNED) */}
      <section className="py-24 bg-white border-t border-gray-100 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 -right-64 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
              <div className="absolute bottom-1/4 -left-64 w-96 h-96 bg-pink-50 rounded-full blur-3xl opacity-50"></div>
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="text-center max-w-3xl mx-auto mb-20">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-gray-600 text-xs font-bold uppercase tracking-wider mb-4">
                      <Star size={14} className="fill-orange-400 text-orange-400"/> {t('home_usp_badge')}
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-6">
                      {t('home_usp_prefix')}<span className="text-[#ff4b9a]">Bhara.online</span>{t('home_usp_suffix')}
                  </h2>
                  <p className="text-xl text-gray-500 font-medium leading-relaxed">
                      {t('home_usp_subheading')}
                  </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                  {/* Card 1 */}
                  <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-2 transition-all duration-300 group">
                      <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                          <LayoutGrid size={32} className="text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-black text-gray-900 mb-4 leading-tight">
                          {t('home_usp_1_title')}
                      </h3>
                      <p className="text-gray-500 leading-relaxed text-base">
                          {t('home_usp_1_desc')}
                      </p>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-[#2d1b4e] rounded-[2.5rem] p-8 border border-gray-800 shadow-xl shadow-gray-900/20 hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
                      
                      <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 relative z-10">
                          <Smartphone size={32} className="text-[#ff4b9a]" />
                      </div>
                      <h3 className="text-2xl font-black text-white mb-4 leading-tight relative z-10">
                          {t('home_usp_2_title')}
                      </h3>
                      <p className="text-gray-300 leading-relaxed text-base relative z-10">
                          {t('home_usp_2_desc')}
                      </p>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:shadow-green-900/10 hover:-translate-y-2 transition-all duration-300 group">
                      <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                          <MapPin size={32} className="text-green-600" />
                      </div>
                      <h3 className="text-2xl font-black text-gray-900 mb-4 leading-tight">
                          {t('home_usp_3_title')}
                      </h3>
                      <p className="text-gray-500 leading-relaxed text-base">
                          {t('home_usp_3_desc')}
                      </p>
                  </div>
              </div>
          </div>
      </section>

      {/* 5. SUPPLY SIDE: Start Earning */}
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
                      <Sparkles size={14} className="fill-[#ff4b9a]"/> {t('home_supply_badge')}
                  </div>
                  
                  <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight tracking-tight">
                      {t('home_supply_title_1')} <br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4b9a] to-orange-400">{t('home_supply_title_2')}</span>
                  </h2>
                  
                  <p className="text-lg md:text-xl text-gray-300 mb-12 leading-relaxed max-w-2xl mx-auto">
                      {t('home_supply_desc')}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-5 justify-center w-full sm:w-auto">
                      <button onClick={navToList} className="bg-[#ff4b9a] text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-[0_10px_40px_-10px_rgba(255,75,154,0.5)] hover:bg-pink-600 hover:scale-105 transition-all active:scale-95 flex items-center justify-center gap-2 w-full sm:w-auto">
                          {t('home_supply_btn_list')} <ArrowRight size={20}/>
                      </button>
                      <button onClick={() => navigate('/marketplace')} className="bg-white/10 border border-white/10 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/20 hover:scale-105 transition-all flex items-center gap-2 justify-center backdrop-blur-md w-full sm:w-auto">
                          <PlayCircle size={20}/> {t('home_supply_btn_browse')}
                      </button>
                  </div>
              </div>
          </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
          <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-16">
                  <div className="col-span-2 lg:col-span-2">
                      <div className="mb-6">
                          <Logo size="md" />
                      </div>
                      <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
                          {t('footer_desc')}
                      </p>
                  </div>
                  
                  <div>
                      <h4 className="font-bold text-gray-900 mb-6">{t('footer_col_market')}</h4>
                      <ul className="space-y-4 text-sm text-gray-500 font-medium">
                          <li><button onClick={() => navToMarket('Real Estate')} className="hover:text-[#ff4b9a] transition-colors">Rent a Flat</button></li>
                          <li><button onClick={() => navToMarket('Vehicles')} className="hover:text-[#ff4b9a] transition-colors">Rent a Car</button></li>
                          <li><button onClick={() => navToMarket('Tech')} className="hover:text-[#ff4b9a] transition-colors">Camera Rental</button></li>
                          <li><button onClick={() => navToMarket('Services')} className="hover:text-[#ff4b9a] transition-colors">Event Venues</button></li>
                      </ul>
                  </div>

                  <div>
                      <h4 className="font-bold text-gray-900 mb-6">{t('footer_col_landlords')}</h4>
                      <ul className="space-y-4 text-sm text-gray-500 font-medium">
                          <li><button onClick={navToList} className="hover:text-[#ff4b9a] transition-colors">List Your Property</button></li>
                          <li><button onClick={navToList} className="hover:text-[#ff4b9a] transition-colors">Earn from Car</button></li>
                          <li><button onClick={() => navigate('/login')} className="hover:text-[#ff4b9a] transition-colors">My Dashboard</button></li>
                          <li><button onClick={() => navigate('/home')} className="hover:text-[#ff4b9a] transition-colors">Rental Calculator</button></li>
                      </ul>
                  </div>

                  <div>
                      <h4 className="font-bold text-gray-900 mb-6">{t('footer_col_support')}</h4>
                      <ul className="space-y-4 text-sm text-gray-500 font-medium">
                          <li><button className="hover:text-[#ff4b9a] transition-colors">Help Center</button></li>
                          <li><button className="hover:text-[#ff4b9a] transition-colors">Safety Guide</button></li>
                          <li><button className="hover:text-[#ff4b9a] transition-colors">Terms of Service</button></li>
                          <li><button className="hover:text-[#ff4b9a] transition-colors">Privacy Policy</button></li>
                      </ul>
                  </div>
              </div>

              <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400 font-medium">
                  <p>{t('footer_rights')}</p>
                  <div className="flex gap-6">
                      <span className="cursor-pointer hover:text-gray-900">{t('footer_privacy')}</span>
                      <span className="cursor-pointer hover:text-gray-900">{t('footer_cookies')}</span>
                      <span className="cursor-pointer hover:text-gray-900">{t('footer_sitemap')}</span>
                  </div>
              </div>
          </div>
      </footer>
    </div>
  );
};

export default Home;
