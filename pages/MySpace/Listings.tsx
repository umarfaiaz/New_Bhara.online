
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, EyeOff, Edit3, MoreVertical, Heart, RefreshCw, BarChart3, Globe } from 'lucide-react';
import { UserService, DataService } from '../../services/mockData';
import { AssetType } from '../../types';

const Listings: React.FC = () => {
    const navigate = useNavigate();
    const currentUser = UserService.getCurrentUser();
    const [items, setItems] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'published' | 'drafts'>('published');

    const refresh = () => {
        const allItems = DataService.getMarketplaceItems(currentUser.id, true);
        setItems(allItems);
    };

    useEffect(() => {
        refresh();
    }, []);

    const published = items.filter(i => i.is_listed);
    const drafts = items.filter(i => !i.is_listed);
    const displayItems = activeTab === 'published' ? published : drafts;

    const handleToggle = (id: string, currentStatus: boolean, type: string) => {
        const realType = items.find(i => i.id === id)?.realType || type;
        DataService.toggleListing(id, realType as AssetType | 'Flat', !currentStatus);
        refresh();
    };

    const handleEditInfo = (item: any) => {
        const realType = item.realType || item.assetType;
        if (realType === 'Flat') {
            navigate('/myspace/inventory/config-flat', { state: { editId: item.id, returnTo: '/myspace/listings' } });
        } else if (realType === 'Vehicle') {
            navigate('/myspace/inventory/config-vehicle', { state: { editId: item.id, returnTo: '/myspace/listings' } });
        } else if (realType === 'Gadget') {
            navigate('/myspace/inventory/config-gadget', { state: { editId: item.id, category: item.category, returnTo: '/myspace/listings' } });
        } else if (realType === 'Service' || realType === 'Professional') {
            navigate('/myspace/inventory/config-service', { state: { editId: item.id, returnTo: '/myspace/listings' } });
        } else if (realType === 'Residential' || realType === 'Building') {
            navigate('/myspace/inventory/config-building', { state: { editId: item.id, returnTo: '/myspace/listings' } });
        } else {
            // Fallback
            navigate('/myspace/inventory');
        }
    };

    return (
        <div className="p-6 md:p-8 space-y-8 pb-32">
             {/* Header Section */}
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Listing Manager</h2>
                    <p className="text-sm text-gray-500">Manage your marketplace presence</p>
                </div>
                <button onClick={() => navigate('/marketplace/post')} className="bg-[#2d1b4e] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg flex items-center gap-2 hover:bg-[#3a2366] transition-colors active:scale-95 transition-transform">
                    <Plus size={18}/> Post New Ad
                </button>
             </div>

             {/* Stats */}
             <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 shadow-sm">
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Active Ads</p>
                    <p className="text-2xl font-black text-blue-700 mt-1">{published.length}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100 shadow-sm">
                    <p className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Total Views</p>
                    <p className="text-2xl font-black text-purple-700 mt-1">1.2k</p>
                </div>
                <div className="bg-pink-50 p-4 rounded-2xl border border-pink-100 shadow-sm">
                    <p className="text-[10px] font-bold text-pink-400 uppercase tracking-wider">Leads</p>
                    <p className="text-2xl font-black text-pink-700 mt-1">45</p>
                </div>
             </div>

             {/* Tabs */}
             <div className="border-b border-gray-200">
                <div className="flex gap-8">
                    <button 
                        onClick={() => setActiveTab('published')} 
                        className={`py-3 text-sm font-bold border-b-[3px] transition-all flex items-center gap-2 ${activeTab === 'published' ? 'border-[#ff4b9a] text-[#ff4b9a]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                    >
                        <Globe size={16}/> Published ({published.length})
                    </button>
                    <button 
                        onClick={() => setActiveTab('drafts')} 
                        className={`py-3 text-sm font-bold border-b-[3px] transition-all flex items-center gap-2 ${activeTab === 'drafts' ? 'border-[#ff4b9a] text-[#ff4b9a]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                    >
                        <EyeOff size={16}/> Drafts ({drafts.length})
                    </button>
                </div>
             </div>

             {/* List */}
             <div className="space-y-4">
                {displayItems.length === 0 && (
                    <div className="text-center py-20 text-gray-400">
                        <BarChart3 size={48} className="mx-auto mb-2 opacity-20"/>
                        <p>No {activeTab} listings.</p>
                        {activeTab === 'drafts' && <p className="text-xs mt-1">Unlist an active item to see it here.</p>}
                    </div>
                )}

                {displayItems.map(item => (
                    <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 group relative hover:shadow-md transition-all">
                        <div className="flex gap-4">
                            <div className="w-24 h-24 rounded-xl bg-gray-100 shrink-0 overflow-hidden relative">
                                <img src={item.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa'} className="w-full h-full object-cover"/>
                                {item.is_listed && <div className="absolute top-1 left-1 bg-green-500 w-2.5 h-2.5 rounded-full ring-2 ring-white"></div>}
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-bold text-gray-900 truncate pr-2 text-base">{item.name}</h3>
                                    <button className="text-gray-400 hover:text-gray-600 p-1"><MoreVertical size={16}/></button>
                                </div>
                                <p className="text-xs text-gray-500 mb-3 font-medium">{item.category} • {item.displayPrice}</p>
                                
                                {/* Management Metrics */}
                                <div className="flex items-center gap-4 mb-3">
                                    <span className="flex items-center gap-1 text-[10px] font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-md"><Eye size={12}/> 240</span>
                                    <span className="flex items-center gap-1 text-[10px] font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-md"><Heart size={12}/> 12</span>
                                </div>

                                <div className="flex gap-3 mt-auto">
                                    <button 
                                        onClick={() => handleEditInfo(item)} 
                                        className="flex-1 py-2 rounded-lg border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-1 transition-colors"
                                    >
                                        <Edit3 size={14}/> Edit Info
                                    </button>
                                    <button 
                                        onClick={() => handleToggle(item.id, item.is_listed, item.realType)}
                                        className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors ${item.is_listed ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                                    >
                                        {item.is_listed ? <><EyeOff size={14}/> Unlist</> : <><RefreshCw size={14}/> Publish</>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
             </div>
        </div>
    );
};

export default Listings;
