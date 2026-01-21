
import React, { useState, useEffect } from 'react';
import { Plus, Wrench, Clock, CheckCircle2, AlertCircle, Camera, X, ChevronDown, Car, Home, Briefcase } from 'lucide-react';
import { DataService } from '../../services/mockData';
import { MaintenanceRequest, AssetType } from '../../types';

const Maintenance: React.FC = () => {
    // Current user 't1'
    const [requests, setRequests] = useState<MaintenanceRequest[]>(DataService.getMaintenanceRequests('t1'));
    const [myRentals, setMyRentals] = useState(DataService.getMyRentals());
    const [showForm, setShowForm] = useState(false);
    
    // Form State
    const [selectedAssetId, setSelectedAssetId] = useState<string>(myRentals[0]?.id || '');
    const [category, setCategory] = useState<MaintenanceRequest['category']>('Plumbing');
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [priority, setPriority] = useState<'Low'|'Medium'|'High'>('Medium');

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'Open': return 'bg-orange-100 text-orange-700';
            case 'In Progress': return 'bg-blue-100 text-blue-700';
            case 'Resolved': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const getIcon = (cat: string) => {
        return <Wrench size={18} />;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const rental = myRentals.find(r => r.id === selectedAssetId);
        if(title && desc && rental) {
            DataService.addMaintenanceRequest({
                tenant_id: 't1',
                asset_id: rental.asset_id,
                asset_name: rental.asset_info?.name || 'Asset',
                title,
                description: desc,
                category,
                priority
            });
            setRequests(DataService.getMaintenanceRequests('t1'));
            setShowForm(false);
            // Reset form
            setTitle(''); setDesc(''); setPriority('Medium');
        }
    };

    return (
        <div className="p-5 pb-32 min-h-screen bg-gray-50 relative">
            {/* Header / Filter */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Issues & Repairs</h2>
                    <p className="text-xs text-gray-500">Track maintenance status</p>
                </div>
                <button 
                    onClick={() => setShowForm(true)}
                    className="bg-[#2d1b4e] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg active:scale-95 transition-transform"
                >
                    <Plus size={16}/> Report Issue
                </button>
            </div>

            {/* List */}
            <div className="space-y-4">
                {requests.map(req => (
                    <div key={req.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500">
                                    {getIcon(req.category)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">{req.title}</h4>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase">{req.asset_name} • {new Date(req.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide ${getStatusColor(req.status)}`}>
                                {req.status}
                            </span>
                        </div>
                        <p className="text-xs text-gray-600 pl-[3.25rem] mb-3">{req.description}</p>
                        <div className="pl-[3.25rem] flex gap-2">
                             <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200">{req.category}</span>
                             <span className={`text-[10px] px-2 py-0.5 rounded border ${req.priority === 'High' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                 {req.priority} Priority
                             </span>
                        </div>
                    </div>
                ))}
                {requests.length === 0 && (
                    <div className="text-center py-10 text-gray-400">
                        <CheckCircle2 size={40} className="mx-auto mb-2 opacity-20"/>
                        <p className="text-sm">No maintenance requests.</p>
                    </div>
                )}
            </div>

            {/* Add Request Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/60 z-50 flex flex-col justify-end sm:justify-center items-center backdrop-blur-sm">
                    <div className="bg-white w-full sm:max-w-md rounded-t-[2rem] sm:rounded-[2rem] p-6 animate-in slide-in-from-bottom duration-300 shadow-2xl h-[85vh] sm:h-auto overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Report an Issue</h3>
                            <button onClick={() => setShowForm(false)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100"><X size={20}/></button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Asset Selection */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2">Select Asset <span className="text-red-500">*</span></label>
                                <div className="space-y-2">
                                    {myRentals.map(rental => (
                                        <div 
                                            key={rental.id} 
                                            onClick={() => setSelectedAssetId(rental.id)}
                                            className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${selectedAssetId === rental.id ? 'border-[#ff4b9a] bg-pink-50' : 'border-gray-200'}`}
                                        >
                                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-500 shadow-sm">
                                                {rental.asset_type === 'Vehicle' ? <Car size={14}/> : rental.asset_type === 'Residential' ? <Home size={14}/> : <Briefcase size={14}/>}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-gray-900">{rental.asset_info?.name}</p>
                                                <p className="text-[10px] text-gray-500">{rental.asset_info?.sub_text}</p>
                                            </div>
                                            {selectedAssetId === rental.id && <div className="w-3 h-3 bg-[#ff4b9a] rounded-full"></div>}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2">Category</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['Plumbing', 'Electrical', 'Appliance', 'Furniture', 'Mechanical', 'Other'].map(cat => (
                                        <button 
                                            key={cat} 
                                            type="button"
                                            onClick={() => setCategory(cat as any)}
                                            className={`py-2 px-1 rounded-xl text-[10px] font-bold border transition-all ${category === cat ? 'bg-[#ff4b9a] text-white border-[#ff4b9a]' : 'bg-white text-gray-600 border-gray-200'}`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2">Title</label>
                                <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#ff4b9a]" placeholder="e.g. Engine Noise or Leaky Tap"/>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2">Description</label>
                                <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#ff4b9a]" placeholder="Describe the issue..."/>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2">Priority</label>
                                <div className="flex bg-gray-100 p-1 rounded-xl">
                                    {['Low', 'Medium', 'High'].map(p => (
                                        <button 
                                            key={p}
                                            type="button"
                                            onClick={() => setPriority(p as any)}
                                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${priority === p ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-gray-400 bg-gray-50 cursor-pointer hover:bg-gray-100">
                                <Camera size={24} className="mb-1"/>
                                <span className="text-[10px] font-bold uppercase">Add Photo</span>
                            </div>

                            <button type="submit" className="w-full py-4 bg-[#2d1b4e] text-white font-bold rounded-xl shadow-lg mt-4 active:scale-95 transition-transform">
                                Submit Request
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Maintenance;
