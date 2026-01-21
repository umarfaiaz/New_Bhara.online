
import React, { useState, useEffect } from 'react';
import { Search, Filter, ShoppingBag, MapPin, Star, Building2, Car, Camera, Briefcase, Calendar, ChevronLeft, ChevronRight, Share2, Heart, Phone, Mail, CheckCircle2, Clock, Plus, ArrowRight, User, X, BedDouble, Bath, Ruler, Fuel, Settings2, ShieldCheck, Eye, EyeOff, LayoutGrid, Zap, Image as ImageIcon, MessageCircle, Edit3, Trash2, Navigation, MousePointerClick, Check, SlidersHorizontal, ArrowDownUp, Flag, ThumbsUp, CalendarDays, Shield, Armchair, Monitor, Home as HomeIcon,  MessageSquare, Layers, ArrowUpDown, Tag, Bike, Music, Shirt, Hammer, Copy, BarChart3, AlertCircle, RefreshCw, MoreVertical } from 'lucide-react';
import { Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import { DataService, ChatService, UserService } from '../services/mockData';
import { AssetType, RentCycle, Building, BaseAsset } from '../types';
import { Logo } from '../components/Logo';
import { MARKETPLACE_CATEGORIES } from '../constants';

// Helper for local auth check
const isAuth = () => localStorage.getItem('bhara_auth') === 'true';

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

// --- MARKETPLACE GRID & LISTINGS ---
const MarketplaceGrid: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = (location.state as any) || {};
    
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

        const matchesSearch = !searchTerm || item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              item.location?.toLowerCase().includes(searchTerm.toLowerCase());
        
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
                 <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-50">
                    <button onClick={() => navigate('/home')} className="p-2.5 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors shrink-0">
                        <HomeIcon size={20}/>
                    </button>
                     <div className="flex-1 relative">
                         <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                         <input 
                            type="text" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search cars, flats, cameras..." 
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#ff4b9a]/20 transition-all text-sm font-medium"
                         />
                     </div>
                     <button 
                        onClick={() => setShowFilters(!showFilters)} 
                        className={`p-2.5 rounded-xl transition-colors shrink-0 ${showFilters ? 'bg-[#ff4b9a] text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                     >
                         <SlidersHorizontal size={20}/>
                     </button>
                     <button 
                        onClick={() => navigate('/myspace/listings')} 
                        className="hidden sm:flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all shrink-0"
                     >
                         My Listings
                     </button>
                     <button 
                        onClick={() => navigate('/marketplace/post')} 
                        className="hidden sm:flex items-center gap-2 bg-[#2d1b4e] text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-black transition-all shrink-0"
                     >
                         <Plus size={18}/> Post Ad
                     </button>
                 </div>
                 
                 {/* Filters Panel */}
                 {showFilters && (
                     <div className="px-4 py-4 bg-white border-b border-gray-100 animate-in slide-in-from-top duration-200">
                         <div className="flex flex-col sm:flex-row gap-4">
                             <div className="flex-1">
                                 <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block">Sort By</label>
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
                                 <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block">Price Range (৳)</label>
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

                 {/* View Tabs & Categories */}
                 <div className="flex items-center gap-4 px-4 pt-3 pb-1 overflow-x-auto scrollbar-hide">
                     <div className="flex bg-gray-100 p-1 rounded-xl shrink-0">
                         <button onClick={() => setActiveTab('Browse')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'Browse' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>Browse</button>
                         <button onClick={() => setActiveTab('Saved')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'Saved' ? 'bg-white shadow-sm text-[#ff4b9a]' : 'text-gray-500'}`}>Saved</button>
                     </div>
                     <div className="w-px h-6 bg-gray-200 shrink-0"></div>
                     <div className="flex gap-2">
                        {categories.map(cat => (
                            <button 
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${selectedCategory === cat ? 'bg-[#2d1b4e] text-white border-[#2d1b4e] shadow-md' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                            >
                                {cat}
                            </button>
                        ))}
                     </div>
                 </div>

                 {/* Sub Categories (Contextual) */}
                 {subCategories.length > 0 && (
                     <div className="px-4 pb-3 pt-2 flex gap-2 overflow-x-auto scrollbar-hide animate-in fade-in slide-in-from-left duration-300">
                         {subCategories.map(sub => (
                             <button 
                                key={sub}
                                onClick={() => setSelectedSubCategory(sub)}
                                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${selectedSubCategory === sub ? 'bg-[#ff4b9a]/10 text-[#ff4b9a] border border-[#ff4b9a]/20' : 'bg-gray-50 text-gray-500 border border-transparent hover:bg-gray-100'}`}
                             >
                                 {sub}
                             </button>
                         ))}
                     </div>
                 )}
                 
                 {/* Results Count Bar */}
                 <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                     <p className="text-[10px] font-bold text-gray-400 uppercase">{filteredItems.length} Results found</p>
                     {searchTerm && <button onClick={() => setSearchTerm('')} className="text-[10px] font-bold text-[#ff4b9a] hover:underline">Clear Search</button>}
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
                         <p className="text-gray-500 font-medium">{activeTab === 'Saved' ? 'No saved items yet.' : 'No items found matching criteria.'}</p>
                         {activeTab === 'Browse' && <button onClick={() => { setSelectedCategory('All'); setSearchTerm(''); setPriceRange({min:'',max:''}); }} className="mt-4 text-[#ff4b9a] font-bold text-sm">Reset Filters</button>}
                     </div>
                 )}
             </div>

             {/* Mobile FAB for Post Ad */}
             <div className="md:hidden fixed bottom-24 right-5 z-40 flex flex-col gap-3">
                 <button onClick={() => navigate('/myspace/listings')} className="bg-white text-gray-700 w-12 h-12 rounded-full shadow-lg border border-gray-100 flex items-center justify-center hover:scale-105 transition-all">
                     <User size={20}/>
                 </button>
                 <button onClick={() => navigate('/marketplace/post')} className="bg-[#ff4b9a] text-white w-14 h-14 rounded-full shadow-xl shadow-pink-500/30 flex items-center justify-center hover:scale-105 active:scale-90 transition-all">
                     <Plus size={28}/>
                 </button>
             </div>
        </div>
    );
};

const AssetCard: React.FC<{ item: any, onClick: () => void, isOwner?: boolean, onEdit?: () => void, onUnlist?: () => void, isWishlisted?: boolean, onToggleWishlist?: (e: any) => void }> = ({ item, onClick, isOwner, onEdit, onUnlist, isWishlisted, onToggleWishlist }) => {
    const isInstant = item.booking_type === 'instant';
    let subLabel = item.category;
    let badgeColor = "bg-gray-100 text-gray-600";
    if (item.assetType === 'Vehicle') { subLabel = item.type; badgeColor = "bg-indigo-50 text-indigo-600"; }
    if (item.assetType === 'Residential') { subLabel = 'Apartment'; badgeColor = "bg-blue-50 text-blue-600"; }
    if (item.assetType === 'Gadget') { subLabel = item.category; badgeColor = "bg-purple-50 text-purple-600"; }
    if (item.assetType === 'Service') { subLabel = item.category; badgeColor = "bg-pink-50 text-pink-600"; }

    const renderDetails = () => {
        switch(item.assetType) {
            case 'Residential':
                return (
                    <div className="flex items-center justify-between text-[10px] text-gray-500 font-medium mt-2">
                        <span className="flex items-center gap-1"><BedDouble size={12}/> {item.details?.bedrooms || 3}</span>
                        <span className="w-px h-3 bg-gray-300"></span>
                        <span className="flex items-center gap-1"><Bath size={12}/> {item.details?.washrooms || 2}</span>
                        <span className="w-px h-3 bg-gray-300"></span>
                        <span className="flex items-center gap-1"><Ruler size={12}/> {item.details?.size || 1200}</span>
                    </div>
                );
            case 'Vehicle':
                return (
                    <div className="flex flex-wrap gap-1 mt-2">
                        <span className="px-1.5 py-0.5 rounded-md bg-gray-50 text-[9px] font-bold text-gray-600 border border-gray-100">{item.details?.model_year || '2019'}</span>
                        <span className="px-1.5 py-0.5 rounded-md bg-gray-50 text-[9px] font-bold text-gray-600 border border-gray-100">{item.details?.fuel || 'CNG'}</span>
                        <span className="px-1.5 py-0.5 rounded-md bg-gray-50 text-[9px] font-bold text-gray-600 border border-gray-100">{item.details?.transmission || 'Auto'}</span>
                    </div>
                );
            case 'Gadget':
                return (
                    <div className="flex items-center gap-1 text-[10px] text-gray-500 font-medium mt-2">
                        <span className="truncate">{item.details?.brand}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span className="truncate">{item.details?.model}</span>
                    </div>
                );
            default:
                return (
                    <div className="mt-2">
                        <p className="text-[10px] text-gray-400 line-clamp-1">{item.listing_description || 'Verified Service'}</p>
                    </div>
                );
        }
    };

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
                    {/* Wishlist Button */}
                    {!isOwner && onToggleWishlist && (
                        <button onClick={onToggleWishlist} className="p-1.5 bg-white/20 backdrop-blur-md rounded-full hover:bg-white transition-colors group/heart">
                            <Heart size={14} className={isWishlisted ? "fill-[#ff4b9a] text-[#ff4b9a]" : "text-white group-hover/heart:text-[#ff4b9a]"} />
                        </button>
                    )}
                </div>
                {isInstant && (
                    <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-[#ff4b9a] text-white rounded text-[8px] font-bold uppercase tracking-wide shadow-sm flex items-center gap-0.5">
                        <Zap size={8} fill="currentColor"/> Instant
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
                {renderDetails()}
                <div className="mt-auto pt-3 flex items-center justify-between">
                    <div>
                        <div className="flex items-baseline gap-0.5">
                            <span className="text-sm font-extrabold text-gray-900">{item.displayPrice}</span>
                            <span className="text-[9px] text-gray-400 font-medium">{item.period}</span>
                        </div>
                        <p className="text-[9px] text-gray-400 flex items-center gap-0.5 truncate max-w-[100px] mt-0.5"><MapPin size={8}/> {item.city || 'Dhaka'}</p>
                    </div>
                    {isOwner ? (
                        <div className="flex gap-1">
                            <button onClick={(e) => { e.stopPropagation(); onEdit && onEdit(); }} className="p-1.5 bg-gray-100 rounded-full hover:bg-blue-50 text-gray-600 hover:text-blue-600"><Edit3 size={12}/></button>
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

const ItemDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const item = DataService.getMarketplaceItems().find(i => i.id === id) as any;
    const currentUser = UserService.getCurrentUser();
    const [wishlist, setWishlist] = useState<string[]>(UserService.getWishlist());
    const [recommendations, setRecommendations] = useState<any[]>([]);
    
    useEffect(() => {
        setWishlist(UserService.getWishlist());
        if(id) setRecommendations(DataService.getRecommendations(id));
    }, [id]);

    if (!item) return <div className="p-10 text-center">Item not found</div>;

    const isOwner = item.user_id === currentUser.id;
    const images = item.images?.length ? item.images : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa'];
    const owner = {
        name: isOwner ? currentUser.name : 'Rafiqul Islam',
        joined: 'Jan 2023',
        avatar: isOwner ? currentUser.avatar : 'https://i.pravatar.cc/150?u=owner',
        verified: true
    };

    const isWishlisted = wishlist.includes(item.id);

    // Determine contact buttons based on preferences
    const preferences: string[] = item.contact_preferences || ['chat', 'phone']; // Default
    const showChat = preferences.includes('chat');
    const showPhone = preferences.includes('phone');
    
    const handleAction = (type: 'chat' | 'request' | 'phone') => {
        if (!isAuth()) { navigate('/login'); return; }
        if (isOwner) { alert("This is your own listing."); return; }
        
        if (type === 'chat') {
            ChatService.startChat(item.user_id, `Hi, I'm interested in ${item.name}.`);
            navigate('/inbox');
        } else if (type === 'phone') {
            window.location.href = 'tel:01700000000'; // Mock number
        } else {
            alert(`Request sent for ${item.name}! Owner will contact you.`);
        }
    };

    const handleShare = async () => {
        const shareData = {
            title: item.name,
            text: `Check out ${item.name} on Bhara.online!`,
            url: window.location.href,
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleWishlist = () => {
        const newList = UserService.toggleWishlist(item.id);
        setWishlist([...newList]);
    };

    const renderKeySpecs = () => {
        const specItem = (label: string, value: string | number, icon: any) => (
            <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="text-gray-400 mb-1">{icon}</div>
                <span className="text-xs font-bold text-gray-900 text-center leading-tight">{value}</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-wide mt-0.5">{label}</span>
            </div>
        );

        if (item.assetType === 'Residential') {
            return (
                <>
                    {specItem('Bedrooms', item.details?.bedrooms || 3, <BedDouble size={18}/>)}
                    {specItem('Bathrooms', item.details?.washrooms || 2, <Bath size={18}/>)}
                    {specItem('Size', `${item.details?.size || 1200} sqft`, <Ruler size={18}/>)}
                    {specItem('Floor', '4th', <Layers size={18}/>)}
                </>
            );
        }
        if (item.assetType === 'Vehicle') {
            return (
                <>
                    {specItem('Model', item.details?.model_year || '2019', <CalendarDays size={18}/>)}
                    {specItem('Fuel', item.details?.fuel || 'CNG', <Fuel size={18}/>)}
                    {specItem('Seats', item.details?.seats || 4, <Armchair size={18}/>)}
                    {specItem('Gear', item.details?.transmission || 'Auto', <Settings2 size={18}/>)}
                </>
            );
        }
        // Generic Specs for Gadgets and others
        return (
            <>
                {specItem('Brand', item.details?.brand || 'Generic', <Star size={18}/>)}
                {specItem('Model', item.details?.model || 'Std', <Camera size={18}/>)}
                {specItem('Condition', 'Good', <ShieldCheck size={18}/>)}
                {specItem('Verified', 'Yes', <CheckCircle2 size={18}/>)}
            </>
        );
    };

    return (
        <div className="min-h-screen bg-white pb-24">
            <div className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md px-4 py-3 flex justify-between items-center border-b border-gray-100">
                <button onClick={() => navigate('/marketplace')} className="p-2 rounded-full hover:bg-gray-100 text-gray-700 transition-colors">
                    <ChevronLeft size={22}/>
                </button>
                <div className="flex gap-2">
                    <button onClick={handleShare} className="p-2 rounded-full hover:bg-gray-100 text-gray-700"><Share2 size={20}/></button>
                    <button onClick={handleWishlist} className="p-2 rounded-full hover:bg-gray-100 text-gray-700">
                        <Heart size={20} className={isWishlisted ? "fill-[#ff4b9a] text-[#ff4b9a]" : ""}/>
                    </button>
                </div>
            </div>

            {/* Gallery */}
            <div className="h-[40vh] bg-gray-100 relative mt-[60px]">
                <img src={images[0]} className="w-full h-full object-cover"/>
                <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                    <ImageIcon size={14}/> 1/{images.length}
                </div>
            </div>

            <div className="px-5 py-6 -mt-6 rounded-t-[2rem] bg-white relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-2">{item.name}</h1>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                            <MapPin size={16} className="text-[#ff4b9a]"/> {item.location}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-black text-[#ff4b9a]">{item.displayPrice}</p>
                        <p className="text-xs font-bold text-gray-400">{item.period}</p>
                    </div>
                </div>

                {/* Key Specs */}
                <div className="grid grid-cols-4 gap-2 mb-8">
                    {renderKeySpecs()}
                </div>

                {/* Additional Charges */}
                {item.additional_charges && item.additional_charges.length > 0 && (
                    <div className="mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-3 text-sm flex items-center gap-2">
                            <Tag size={16} className="text-[#ff4b9a]"/> Other Charges
                        </h3>
                        <div className="space-y-2">
                            {item.additional_charges.map((charge: any) => (
                                <div key={charge.id} className="flex justify-between items-center text-xs">
                                    <span className="text-gray-600 font-medium">{charge.name} <span className="text-[9px] text-gray-400">({charge.type})</span></span>
                                    <span className="font-bold text-gray-900">৳{charge.amount}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Description */}
                <div className="mb-8">
                    <h3 className="font-bold text-gray-900 mb-3 text-sm">Description</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        {item.listing_description || 'No description provided. Contact the owner for more details.'}
                    </p>
                </div>

                {/* Owner */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl mb-8 border border-gray-100">
                    <div className="relative">
                        <img src={owner.avatar} className="w-12 h-12 rounded-full object-cover border border-white shadow-sm" alt="Owner"/>
                        {owner.verified && <CheckCircle2 size={16} className="absolute -bottom-1 -right-1 text-green-500 bg-white rounded-full"/>}
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-sm">{owner.name}</h4>
                        <p className="text-[10px] text-gray-500">Member since {owner.joined}</p>
                    </div>
                    <button className="text-xs font-bold text-[#ff4b9a] hover:underline">View Profile</button>
                </div>

                {/* Recommendation Engine */}
                {recommendations.length > 0 && (
                    <div className="mb-8 pt-8 border-t border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><SparklesIcon size={16} className="text-yellow-500 fill-yellow-500"/> You Might Also Like</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {recommendations.map(rec => (
                                <div key={rec.id} onClick={() => navigate(`/marketplace/item/${rec.id}`)} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer">
                                    <div className="h-24 bg-gray-200">
                                        <img src={rec.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa'} className="w-full h-full object-cover"/>
                                    </div>
                                    <div className="p-3">
                                        <h4 className="font-bold text-xs text-gray-900 truncate">{rec.name}</h4>
                                        <p className="text-[10px] text-gray-500">{rec.displayPrice}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex gap-3 safe-bottom z-40">
                {showPhone && (
                    <button onClick={() => handleAction('phone')} className="p-4 bg-gray-100 rounded-xl text-gray-900 hover:bg-gray-200 transition-colors">
                        <Phone size={20}/>
                    </button>
                )}
                {showChat && (
                    <button onClick={() => handleAction('chat')} className="flex-1 py-4 bg-[#2d1b4e] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors shadow-lg">
                        <MessageCircle size={20}/> Chat Now
                    </button>
                )}
                {!showChat && !showPhone && (
                    <button onClick={() => handleAction('request')} className="flex-1 py-4 bg-[#ff4b9a] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-pink-600 transition-colors shadow-lg shadow-pink-200">
                        Request Booking
                    </button>
                )}
            </div>
        </div>
    );
};

// Helper for Recommendation Icon
const SparklesIcon = ({size, className}: {size:number, className:string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
);

// ... PostAd ...
const PostAd: React.FC = () => {
    const navigate = useNavigate();
    // Redirect to inventory config flow with flag
    useEffect(() => {
        navigate('/myspace/inventory/select-type', { state: { returnTo: '/marketplace', isMarketplace: true } });
    }, []);
    return null;
};

export default Marketplace;
