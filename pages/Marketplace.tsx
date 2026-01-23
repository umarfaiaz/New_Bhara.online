
import React, { useState, useEffect } from 'react';
import { Search, Filter, ShoppingBag, MapPin, Star, Building2, Car, Camera, Briefcase, Calendar, ChevronLeft, ChevronRight, Share2, Heart, Phone, Mail, CheckCircle2, Clock, Plus, ArrowRight, User, X, BedDouble, Bath, Ruler, Fuel, Settings2, ShieldCheck, Eye, EyeOff, LayoutGrid, Zap, Image as ImageIcon, MessageCircle, Edit, Trash2, Navigation, MousePointerClick, Check, SlidersHorizontal, ArrowDownUp, Flag, ThumbsUp, CalendarDays, Shield, Armchair, Monitor, Home as HomeIcon,  MessageSquare, Layers, ArrowUpDown, Tag, Bike, Music, Shirt, Hammer, Copy, BarChart3, AlertCircle, RefreshCw, MoreVertical, Store, Percent, BookOpen, AlertOctagon, Flame, Droplets } from 'lucide-react';
import { Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import { DataService, ChatService, UserService } from '../services/mockData';
import { AssetType, RentCycle, Building, BaseAsset, User as UserType } from '../types';
import { Logo } from '../components/Logo';
import { MARKETPLACE_CATEGORIES } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

// Helper for local auth check
const isAuth = () => localStorage.getItem('bhara_auth') === 'true';

// Helper to format location object to string
const formatLocation = (loc: any) => {
    if (!loc) return '';
    if (typeof loc === 'string') return loc;
    const parts = [];
    if (loc.area) parts.push(loc.area);
    if (loc.district) parts.push(loc.district);
    if (parts.length === 0) return 'Bangladesh';
    return parts.join(', ');
};

// --- MAIN WRAPPER ---
const Marketplace: React.FC = () => {
  return (
    <Routes>
      <Route index element={<MarketplaceGrid />} />
      <Route path="item/:id" element={<ItemDetails />} />
      <Route path="post" element={<PostAd />} />
    </Routes>
  );
};

// --- ITEM DETAILS COMPONENT ---
const ItemDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [item, setItem] = useState<any>(null);

    useEffect(() => {
        if (id) {
            const found = DataService.getMarketplaceItems(undefined, true).find((i: any) => i.id === id);
            setItem(found);
        }
    }, [id]);

    if (!item) return <div className="p-10 text-center text-gray-500">{t('mkt_no_items')}</div>;

    return (
        <div className="bg-white min-h-screen pb-20">
             <div className="flex items-center gap-3 p-4 border-b sticky top-0 bg-white/90 backdrop-blur-md z-30">
                 <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full"><ChevronLeft size={24} /></button>
                 <span className="font-bold text-lg truncate">{item.name}</span>
             </div>

             <div className="max-w-5xl mx-auto p-4 md:p-8">
                 <div className="grid md:grid-cols-2 gap-8">
                     <div className="aspect-[4/3] bg-gray-100 rounded-3xl overflow-hidden relative">
                         <img src={item.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa'} className="w-full h-full object-cover"/>
                     </div>
                     
                     <div className="space-y-8">
                         <div>
                             <div className="flex items-center gap-2 mb-2">
                                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold uppercase tracking-wider">{item.category}</span>
                                {item.is_listed && <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1"><CheckCircle2 size={12}/> {t('item_verified')}</span>}
                             </div>
                             <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">{item.name}</h1>
                             <p className="text-gray-500 font-medium mt-2 flex items-center gap-1"><MapPin size={16}/> {typeof item.location === 'string' ? item.location : `${item.location?.area}, ${item.location?.district}`}</p>
                         </div>
                         
                         <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                             <p className="text-xs font-bold text-gray-400 uppercase mb-1">{t('item_rent')}</p>
                             <div className="flex items-baseline gap-2">
                                 <span className="text-4xl font-black text-[#ff4b9a]">{item.displayPrice}</span>
                                 <span className="text-gray-400 font-bold text-sm">/ {item.period}</span>
                             </div>
                         </div>

                         <div>
                             <h3 className="font-bold text-gray-900 mb-3 text-lg">{t('item_about')}</h3>
                             <p className="text-gray-600 leading-relaxed whitespace-pre-line">{item.description || "No description provided."}</p>
                         </div>

                         {/* Action Bar */}
                         <div className="flex gap-4 pt-4 border-t border-gray-100">
                             <button 
                                onClick={() => {
                                    ChatService.startChat(item.user_id, `Hi, I'm interested in ${item.name}`);
                                    navigate('/inbox');
                                }} 
                                className="flex-1 py-4 bg-[#2d1b4e] text-white rounded-2xl font-bold shadow-xl hover:bg-[#3a2366] active:scale-95 transition-all flex items-center justify-center gap-2"
                             >
                                 <MessageCircle size={20}/> {t('item_chat_owner')}
                             </button>
                             <button className="p-4 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors">
                                 <Heart size={24} className="text-gray-600"/>
                             </button>
                         </div>
                     </div>
                 </div>
             </div>
        </div>
    );
};

// --- USER PROFILE MODAL (REUSABLE) ---
export const UserProfileModal: React.FC<{ userId: string, onClose: () => void }> = ({ userId, onClose }) => {
    const { t } = useLanguage();
    const [user, setUser] = useState<UserType | null>(null);
    useEffect(() => {
        // Mock fetching user
        const u = UserService.getUserById(userId);
        setUser(u as UserType);
    }, [userId]);

    if (!user) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white w-full max-w-sm rounded-[2rem] p-6 shadow-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"><X size={20}/></button>
                <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full p-1 border-2 border-[#ff4b9a] mb-4">
                        <img src={user.avatar || 'https://i.pravatar.cc/150'} className="w-full h-full rounded-full object-cover"/>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{user.role === 'lender' ? 'Verified Owner' : 'Member'}</p>
                    <div className="flex gap-2 mb-6">
                        <span className="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase rounded-full flex items-center gap-1"><ShieldCheck size={12}/> ID Verified</span>
                        <span className="px-3 py-1 bg-yellow-50 text-yellow-700 text-[10px] font-bold uppercase rounded-full flex items-center gap-1"><Star size={12}/> 4.8 Rating</span>
                    </div>
                    <div className="w-full grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                        <div className="text-center">
                            <p className="text-lg font-black text-gray-900">12</p>
                            <p className="text-xs text-gray-400 font-bold uppercase">{t('item_listings')}</p>
                        </div>
                        <div className="text-center border-l border-gray-100">
                            <p className="text-lg font-black text-gray-900">2y</p>
                            <p className="text-xs text-gray-400 font-bold uppercase">{t('item_member_since')}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-full mt-6 py-3 bg-[#2d1b4e] text-white font-bold rounded-xl shadow-lg active:scale-95 transition-transform">
                        {t('item_close')}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- MARKETPLACE GRID & LISTINGS ---
const MarketplaceGrid: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = (location.state as any) || {};
    const { t } = useLanguage();
    
    // State
    const [searchTerm, setSearchTerm] = useState(state.search || '');
    const [selectedCategory, setSelectedCategory] = useState(state.category || 'All');
    const [selectedSubCategory, setSelectedSubCategory] = useState<string>('All');
    const [showFilters, setShowFilters] = useState(false);
    const [activeTab, setActiveTab] = useState<'Browse' | 'Saved'>('Browse');
    const [wishlist, setWishlist] = useState<string[]>(UserService.getWishlist());
    
    // Filters
    const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');
    const [priceRange, setPriceRange] = useState<{min: string, max: string}>({min: '', max: ''});

    useEffect(() => {
        setSelectedSubCategory('All');
    }, [selectedCategory]);

    useEffect(() => {
        setWishlist(UserService.getWishlist());
    }, []);

    const allItems = DataService.getMarketplaceItems();

    const filteredItems = allItems.filter((item: any) => {
        if (activeTab === 'Saved' && !wishlist.includes(item.id)) return false;

        const locationStr = formatLocation(item.location);
        const matchesSearch = !searchTerm || item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              locationStr.toLowerCase().includes(searchTerm.toLowerCase());
        
        let matchesCategory = true;
        if (selectedCategory !== 'All') {
            matchesCategory = item.category === selectedCategory;
            if (matchesCategory && selectedSubCategory !== 'All') {
                const sub = selectedSubCategory.toLowerCase();
                const typeMatch = item.type?.toLowerCase() === sub;
                const nameMatch = item.name?.toLowerCase().includes(sub);
                matchesCategory = typeMatch || nameMatch;
            }
        }

        const price = parseInt(item.displayPrice.replace(/[^0-9]/g, '')) || 0;
        const min = priceRange.min ? parseInt(priceRange.min) : 0;
        const max = priceRange.max ? parseInt(priceRange.max) : Infinity;
        const matchesPrice = price >= min && price <= max;
        
        return matchesSearch && matchesCategory && matchesPrice;
    }).sort((a: any, b: any) => {
        const priceA = parseInt(a.displayPrice.replace(/[^0-9]/g, '')) || 0;
        const priceB = parseInt(b.displayPrice.replace(/[^0-9]/g, '')) || 0;
        
        if (sortBy === 'price_asc') return priceA - priceB;
        if (sortBy === 'price_desc') return priceB - priceA;
        return 0; 
    });

    const categories = ['All', ...Object.keys(MARKETPLACE_CATEGORIES)];
    const subCategories = selectedCategory !== 'All' ? ['All', ...MARKETPLACE_CATEGORIES[selectedCategory]] : [];

    const handleWishlistToggle = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const newList = UserService.toggleWishlist(id);
        setWishlist([...newList]);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
             {/* Header */}
             <div className="bg-white sticky top-0 z-30 shadow-sm safe-top transition-all">
                 
                 {/* Row 1: Logo & Search */}
                 <div className="px-4 py-3 flex items-center justify-between gap-4 border-b border-gray-50">
                    <div onClick={() => navigate('/home')} className="cursor-pointer shrink-0">
                        <Logo size="sm" />
                    </div>
                     <div className="max-w-xs w-full relative ml-auto">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                         <input 
                            type="text" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={t('mkt_search_placeholder')} 
                            className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-full outline-none focus:ring-2 focus:ring-[#ff4b9a]/20 transition-all text-sm font-medium"
                         />
                     </div>
                 </div>

                 {/* Row 2: Controls (Modes | Highlighted Actions | Filter) */}
                 <div className="px-4 py-2 flex items-center justify-between gap-3 overflow-x-auto scrollbar-hide border-b border-gray-50">
                     {/* Modes */}
                     <div className="flex bg-gray-100 p-1 rounded-lg shrink-0">
                         <button onClick={() => setActiveTab('Browse')} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'Browse' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>{t('mkt_browse')}</button>
                         <button onClick={() => setActiveTab('Saved')} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'Saved' ? 'bg-white shadow-sm text-[#ff4b9a]' : 'text-gray-500'}`}>{t('mkt_saved')}</button>
                     </div>

                     {/* Right Actions - REDESIGNED */}
                     <div className="flex items-center gap-2 shrink-0">
                         {/* Highlighted 'Post Ad' Button */}
                         <button 
                            onClick={() => navigate('/marketplace/post')} 
                            className="flex items-center gap-1.5 bg-[#2d1b4e] text-white px-3.5 py-2 rounded-xl font-bold text-xs shadow-md hover:bg-black transition-all active:scale-95"
                         >
                             <Plus size={14}/> {t('mkt_post_ad')}
                         </button>
                         
                         {/* 'My Listings' Button */}
                         <button 
                            onClick={() => navigate('/myspace/assets')} 
                            className="flex items-center gap-1.5 bg-white border border-gray-200 text-gray-700 px-3.5 py-2 rounded-xl font-bold text-xs hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95"
                         >
                             <User size={14}/> {t('mkt_my_ads')}
                         </button>

                         <div className="w-px h-6 bg-gray-200 mx-1"></div>
                         
                         {/* Filter Button */}
                         <button 
                            onClick={() => setShowFilters(!showFilters)} 
                            className={`p-2 rounded-xl transition-colors border ${showFilters ? 'bg-[#ff4b9a] border-[#ff4b9a] text-white shadow-sm' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                         >
                             <SlidersHorizontal size={16}/>
                         </button>
                     </div>
                 </div>
                 
                 {/* Filters Panel (Conditional) */}
                 {showFilters && (
                     <div className="px-4 py-4 bg-white border-b border-gray-100 animate-in slide-in-from-top duration-200">
                         <div className="flex flex-col sm:flex-row gap-4">
                             <div className="flex-1">
                                 <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block">{t('mkt_sort_by')}</label>
                                 <div className="flex bg-gray-100 p-1 rounded-lg">
                                     {[
                                         { id: 'newest', label: 'Newest' },
                                         { id: 'price_asc', label: 'Price: Low' },
                                         { id: 'price_desc', label: 'Price: High' }
                                     ].map(opt => (
                                         <button 
                                            key={opt.id} 
                                            onClick={() => setSortBy(opt.id as any)} 
                                            className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${sortBy === opt.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
                                         >
                                             {opt.label}
                                         </button>
                                     ))}
                                 </div>
                             </div>
                             <div className="flex-1">
                                 <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block">{t('mkt_price_range')} (৳)</label>
                                 <div className="flex gap-2">
                                     <input 
                                        type="number" 
                                        placeholder="Min" 
                                        value={priceRange.min}
                                        onChange={e => setPriceRange({...priceRange, min: e.target.value})}
                                        className="w-full bg-gray-100 px-3 py-2 rounded-lg text-sm font-bold outline-none focus:ring-1 focus:ring-[#ff4b9a]"
                                     />
                                     <input 
                                        type="number" 
                                        placeholder="Max" 
                                        value={priceRange.max}
                                        onChange={e => setPriceRange({...priceRange, max: e.target.value})}
                                        className="w-full bg-gray-100 px-3 py-2 rounded-lg text-sm font-bold outline-none focus:ring-1 focus:ring-[#ff4b9a]"
                                     />
                                 </div>
                             </div>
                         </div>
                     </div>
                 )}

                 {/* Row 3: Categories */}
                 <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide border-b border-gray-50">
                    {categories.map(cat => (
                        <button 
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${selectedCategory === cat ? 'bg-[#2d1b4e] text-white border-[#2d1b4e] shadow-sm' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                        >
                            {cat}
                        </button>
                    ))}
                 </div>

                 {/* Row 4: Sub Categories (Contextual) */}
                 {subCategories.length > 0 && (
                     <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide bg-gray-50/50">
                         {subCategories.map(sub => (
                             <button 
                                key={sub}
                                onClick={() => setSelectedSubCategory(sub)}
                                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${selectedSubCategory === sub ? 'bg-[#ff4b9a] text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-300'}`}
                             >
                                 {sub}
                             </button>
                         ))}
                     </div>
                 )}
                 
                 {/* Results Count Bar */}
                 <div className="px-4 py-2 bg-white border-b border-gray-50 flex justify-between items-center">
                     <p className="text-[10px] font-bold text-gray-400 uppercase">{filteredItems.length} {t('mkt_results')}</p>
                     {searchTerm && <button onClick={() => setSearchTerm('')} className="text-[10px] font-bold text-[#ff4b9a] hover:underline">{t('mkt_clear_search')}</button>}
                 </div>
             </div>

             {/* Grid */}
             <div className="max-w-7xl mx-auto p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                 {filteredItems.map((item: any) => (
                     <AssetCard 
                        key={item.id} 
                        item={item} 
                        onClick={() => navigate(`/marketplace/item/${item.id}`)}
                        isWishlisted={wishlist.includes(item.id)}
                        onToggleWishlist={(e) => handleWishlistToggle(item.id, e)}
                     />
                 ))}
                 {filteredItems.length === 0 && (
                     <div className="col-span-full text-center py-20">
                         <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4"/>
                         <p className="text-gray-500 font-medium">{activeTab === 'Saved' ? t('mkt_no_saved') : t('mkt_no_items')}</p>
                         {activeTab === 'Browse' && <button onClick={() => { setSelectedCategory('All'); setSearchTerm(''); setPriceRange({min:'',max:''}); }} className="mt-4 text-[#ff4b9a] font-bold text-sm">{t('mkt_reset')}</button>}
                     </div>
                 )}
             </div>
        </div>
    );
};

const AssetCard: React.FC<{ item: any, onClick: () => void, isOwner?: boolean, onEdit?: () => void, onUnlist?: () => void, isWishlisted?: boolean, onToggleWishlist?: (e: any) => void }> = ({ item, onClick, isOwner, onEdit, onUnlist, isWishlisted, onToggleWishlist }) => {
    // New Flags based on updates
    const isInstant = item.booking_type === 'Instant';
    const weeklyDiscount = item.marketplace_settings?.discounts?.weekly;
    const monthlyDiscount = item.marketplace_settings?.discounts?.monthly;
    const hasDiscount = (weeklyDiscount > 0 || monthlyDiscount > 0);
    const charges = item.charges || {};
    const customCharges = charges.customCharges || [];

    // Calculate Price Logic for Card
    const baseRent = parseInt(item.displayPrice.replace(/[^0-9]/g, '')) || 0;
    let totalPrice = baseRent;
    
    // If Daily, add mandatory daily charges (e.g. driver) to total shown
    if (item.period === 'Daily') {
        if (charges.driverFee) totalPrice += charges.driverFee;
    }

    // Discount Calculation
    let discountedPrice: number | null = null;
    let applicableDiscount = 0;
    if (item.period === 'Monthly') applicableDiscount = monthlyDiscount;
    else if (item.period === 'Weekly') applicableDiscount = weeklyDiscount;
    
    if (applicableDiscount > 0) {
        discountedPrice = totalPrice - (totalPrice * applicableDiscount / 100);
    }

    let subLabel = item.category;
    let badgeColor = "bg-gray-100 text-gray-600";
    if (item.assetType === 'Vehicle') { subLabel = item.type; badgeColor = "bg-indigo-50 text-indigo-600"; }
    if (item.assetType === 'Residential') { subLabel = 'Apartment'; badgeColor = "bg-blue-50 text-blue-600"; }
    if (item.assetType === 'Commercial') { subLabel = 'Commercial'; badgeColor = "bg-cyan-50 text-cyan-600"; }
    if (item.assetType === 'Gadget') { subLabel = item.category; badgeColor = "bg-purple-50 text-purple-600"; }
    if (item.assetType === 'Service') { subLabel = item.category; badgeColor = "bg-pink-50 text-pink-600"; }
    if (item.assetType === 'Skill') { subLabel = 'Skill'; badgeColor = "bg-teal-50 text-teal-600"; }

    return (
        <div 
            onClick={onClick}
            className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col h-full relative"
        >
            <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                <img 
                    src={item.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800'} 
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
                    <span className={`px-2 py-1 backdrop-blur-md rounded-md text-[8px] font-bold uppercase tracking-wide shadow-sm ${badgeColor}`}>
                        {subLabel}
                    </span>
                    {!isOwner && onToggleWishlist && (
                        <button onClick={onToggleWishlist} className="p-1.5 bg-white/20 backdrop-blur-md rounded-full hover:bg-white transition-colors group/heart">
                            <Heart size={14} className={isWishlisted ? "fill-[#ff4b9a] text-[#ff4b9a]" : "text-white group-hover/heart:text-[#ff4b9a]"} />
                        </button>
                    )}
                </div>
                {isInstant && (
                    <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-yellow-400 text-black rounded text-[8px] font-bold uppercase tracking-wide shadow-sm flex items-center gap-0.5">
                        <Zap size={8} fill="currentColor"/> Instant
                    </div>
                )}
                {hasDiscount && (
                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-green-500 text-white rounded text-[8px] font-bold uppercase tracking-wide shadow-sm flex items-center gap-0.5">
                        <Percent size={8}/> {Math.max(weeklyDiscount, monthlyDiscount)}% Off
                    </div>
                )}
            </div>

            <div className="p-3 flex flex-col flex-1">
                <div className="flex justify-between items-start gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900 leading-tight line-clamp-1">{item.name}</h3>
                    <div className="flex items-center gap-0.5 text-[9px] font-bold text-gray-600">
                        <Star size={9} className="text-orange-400 fill-orange-400"/> 4.8
                    </div>
                </div>
                
                {/* CHARGES PILLS - NEW FEATURE */}
                {(charges.serviceCharge > 0 || charges.gasFee > 0 || charges.driverFee > 0 || customCharges.length > 0) && (
                    <div className="flex flex-wrap gap-1 mt-2">
                        {charges.serviceCharge > 0 && <span className="px-1.5 py-0.5 bg-gray-50 border border-gray-100 rounded text-[9px] text-gray-500 font-medium">Service ৳{charges.serviceCharge}</span>}
                        {charges.gasFee > 0 && <span className="px-1.5 py-0.5 bg-orange-50 border border-orange-100 rounded text-[9px] text-orange-600 font-medium flex items-center gap-0.5"><Flame size={8}/> Gas</span>}
                        {charges.driverFee > 0 && <span className="px-1.5 py-0.5 bg-blue-50 border border-blue-100 rounded text-[9px] text-blue-600 font-medium">Driver +৳{charges.driverFee}</span>}
                        {customCharges.length > 0 && (
                            <span className="px-1.5 py-0.5 bg-purple-50 border border-purple-100 rounded text-[9px] text-purple-600 font-medium">
                                +{customCharges.length} Extra
                            </span>
                        )}
                    </div>
                )}

                <div className="mt-auto pt-3 flex items-center justify-between">
                    <div>
                        <div className="flex items-baseline gap-1">
                            {discountedPrice !== null ? (
                                <>
                                    <span className="text-[10px] text-gray-400 line-through font-bold">৳{totalPrice.toLocaleString()}</span>
                                    <span className="text-sm font-extrabold text-[#ff4b9a]">৳{discountedPrice.toLocaleString()}</span>
                                </>
                            ) : (
                                <span className="text-sm font-extrabold text-gray-900">৳{totalPrice.toLocaleString()}</span>
                            )}
                            <span className="text-[9px] text-gray-400 font-medium">{item.period}</span>
                        </div>
                        <p className="text-[9px] text-gray-400 flex items-center gap-0.5 truncate max-w-[100px] mt-0.5"><MapPin size={8}/> {formatLocation(item.location)}</p>
                    </div>
                    {isOwner ? (
                        <div className="flex gap-1">
                            <button onClick={(e) => { e.stopPropagation(); onEdit && onEdit(); }} className="p-1.5 bg-gray-100 rounded-full hover:bg-blue-50 text-gray-600 hover:text-blue-600"><Edit size={12}/></button>
                            <button onClick={(e) => { e.stopPropagation(); onUnlist && onUnlist(); }} className="p-1.5 bg-gray-100 rounded-full hover:bg-red-50 text-gray-600 hover:text-red-600"><Trash2 size={12}/></button>
                        </div>
                    ) : (
                        <button className="bg-gray-50 hover:bg-[#ff4b9a] text-gray-400 hover:text-white p-1.5 rounded-full transition-colors">
                            <ArrowRight size={14}/>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// ... PostAd ...
const PostAd: React.FC = () => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate('/myspace/rentals', { state: { openWizard: true, isMarketplace: true } });
    }, []);
    return null;
};

export default Marketplace;
