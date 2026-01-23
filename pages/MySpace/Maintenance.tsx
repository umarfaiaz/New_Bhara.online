import React, { useState, useEffect } from 'react';
import { 
    Plus, Wrench, Clock, CheckCircle2, AlertCircle, Camera, X, ChevronRight, 
    Car, Home, Briefcase, Zap, Droplets, Armchair, Hammer, Check, ArrowRight,
    MessageCircle, AlertTriangle, Calendar, Filter
} from 'lucide-react';
import { DataService, UserService, ChatService } from '../../services/mockData';
import { MaintenanceRequest } from '../../types';
import { useNavigate } from 'react-router-dom';

// --- CONFIG & CONSTANTS ---

const ISSUE_CATEGORIES = [
    { id: 'Plumbing', label: 'Plumbing', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50', sub: ['Leaky Faucet', 'Clogged Drain', 'Pipe Leak', 'No Water', 'Low Pressure', 'Water Heater'] },
    { id: 'Electrical', label: 'Electrical', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-50', sub: ['Power Outage', 'Faulty Switch', 'Short Circuit', 'Light Fixture', 'Fan Issue'] },
    { id: 'Appliance', label: 'Appliance', icon: AlertCircle, color: 'text-purple-500', bg: 'bg-purple-50', sub: ['AC Not Cooling', 'Fridge Issue', 'Oven/Stove', 'Washing Machine', 'Geyser'] },
    { id: 'Structural', label: 'Structural', icon: Home, color: 'text-orange-500', bg: 'bg-orange-50', sub: ['Wall Damp', 'Tile Broken', 'Door/Window', 'Lock Issue', 'Paint Peeling'] },
    { id: 'Furniture', label: 'Furniture', icon: Armchair, color: 'text-pink-500', bg: 'bg-pink-50', sub: ['Broken Chair', 'Table Issue', 'Wardrobe', 'Bed'] },
    { id: 'Other', label: 'Other', icon: Hammer, color: 'text-gray-500', bg: 'bg-gray-50', sub: ['Pest Control', 'Noise Complaint', 'Security Issue', 'Internet'] },
];

const Maintenance: React.FC = () => {
    const navigate = useNavigate();
    const currentUser = UserService.getCurrentUser();
    const isOwner = currentUser.role === 'lender';

    const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
    const [filterStatus, setFilterStatus] = useState<'All' | 'Open' | 'In Progress' | 'Resolved'>('All');
    
    // Renter Wizard State
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [wizardStep, setWizardStep] = useState(1);
    const [newIssue, setNewIssue] = useState<Partial<MaintenanceRequest>>({
        priority: 'Medium',
        category: 'Plumbing'
    });

    useEffect(() => {
        refreshData();
    }, [isOwner]); // Refresh when role switches

    const refreshData = () => {
        const reqs = DataService.getMaintenanceRequests(currentUser.id);
        setRequests(reqs.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    };

    const handleUpdateStatus = (id: string, newStatus: 'In Progress' | 'Resolved') => {
        DataService.updateMaintenanceStatus(id, newStatus);
        refreshData();
    };

    // --- RENTER WIZARD SUBMIT ---
    const submitIssue = () => {
        // Mock finding the asset (usually 1 active rental for renter)
        const myRentals = DataService.getMyRentals();
        
        // Ensure there is a rental to associate with
        const assetId = myRentals.length > 0 ? myRentals[0].asset_id : 'unknown';
        const assetName = myRentals.length > 0 ? myRentals[0].asset_info?.name : 'General Inquiry';

        DataService.addMaintenanceRequest({
            tenant_id: currentUser.id, // Use actual current user ID
            asset_id: assetId,
            asset_name: assetName,
            title: newIssue.subCategory || newIssue.title || 'Maintenance Issue',
            description: newIssue.description || 'No description provided.',
            category: newIssue.category as any,
            subCategory: newIssue.subCategory,
            priority: newIssue.priority
        });
        
        setIsWizardOpen(false);
        setWizardStep(1);
        setNewIssue({ priority: 'Medium', category: 'Plumbing' });
        refreshData();
    };

    // --- FILTER LOGIC ---
    const filteredRequests = requests.filter(req => {
        if (filterStatus === 'All') return true;
        return req.status === filterStatus;
    });

    // --- OWNER VIEW ---
    if (isOwner) {
        return (
            <div className="max-w-5xl mx-auto p-6 pb-32">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Maintenance Board</h2>
                        <p className="text-sm text-gray-500 font-medium mt-1">Manage & resolve tenant issues.</p>
                    </div>
                    <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
                        {['All', 'Open', 'In Progress', 'Resolved'].map(s => (
                            <button 
                                key={s} 
                                onClick={() => setFilterStatus(s as any)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filterStatus === s ? 'bg-gray-900 text-white shadow' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredRequests.map(req => {
                        const CatConfig = ISSUE_CATEGORIES.find(c => c.id === req.category) || ISSUE_CATEGORIES[0];
                        const Icon = CatConfig.icon;
                        return (
                            <div key={req.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col relative overflow-hidden">
                                <div className={`h-1.5 w-full ${req.priority === 'High' ? 'bg-red-500' : req.priority === 'Medium' ? 'bg-orange-400' : 'bg-green-400'}`}></div>
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${CatConfig.bg} ${CatConfig.color}`}>
                                            <Icon size={20}/>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${req.status === 'Open' ? 'bg-orange-50 text-orange-600 border-orange-100' : req.status === 'In Progress' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                                            {req.status}
                                        </span>
                                    </div>
                                    
                                    <h4 className="font-bold text-gray-900 text-sm mb-1 line-clamp-1">{req.title}</h4>
                                    <p className="text-xs text-gray-500 mb-3">{req.subCategory && <span className="font-semibold text-gray-700">{req.subCategory} • </span>} {req.asset_name}</p>
                                    
                                    <div className="mt-auto pt-3 border-t border-gray-50 flex gap-2">
                                        {req.status === 'Open' && (
                                            <button onClick={() => handleUpdateStatus(req.id, 'In Progress')} className="flex-1 py-2 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-100 transition-colors">
                                                Accept
                                            </button>
                                        )}
                                        {req.status !== 'Resolved' && (
                                            <button onClick={() => handleUpdateStatus(req.id, 'Resolved')} className="flex-1 py-2 bg-green-50 text-green-600 text-xs font-bold rounded-lg hover:bg-green-100 transition-colors flex items-center justify-center gap-1">
                                                <Check size={12}/> Resolve
                                            </button>
                                        )}
                                        <button onClick={() => { ChatService.startChat(req.tenant_id, `Regarding: ${req.title}`); navigate('/inbox'); }} className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100">
                                            <MessageCircle size={16}/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {filteredRequests.length === 0 && (
                        <div className="col-span-full py-20 text-center text-gray-400 bg-white rounded-3xl border border-dashed border-gray-200">
                            <CheckCircle2 size={48} className="mx-auto mb-4 opacity-20"/>
                            <p className="font-medium">No tasks in this view.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // --- RENTER VIEW ---
    return (
        <div className="p-6 pb-32 min-h-screen bg-gray-50 max-w-2xl mx-auto">
            {!isWizardOpen ? (
                <>
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Report Issue</h2>
                            <p className="text-xs text-gray-500 font-medium mt-1">Get things fixed quickly.</p>
                        </div>
                        <button 
                            onClick={() => setIsWizardOpen(true)}
                            className="bg-[#2d1b4e] text-white px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg hover:bg-[#3a2366] active:scale-95 transition-all"
                        >
                            <Plus size={16}/> New Request
                        </button>
                    </div>

                    <div className="space-y-4">
                        {requests.map(req => {
                            const CatConfig = ISSUE_CATEGORIES.find(c => c.id === req.category) || ISSUE_CATEGORIES[0];
                            const Icon = CatConfig.icon;
                            return (
                                <div key={req.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-4 group">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${CatConfig.bg} ${CatConfig.color}`}>
                                        <Icon size={24}/>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-gray-900 text-sm truncate">{req.title}</h4>
                                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${req.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                {req.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 line-clamp-1">{req.description}</p>
                                        <div className="mt-2 flex items-center gap-2 text-[10px] font-bold text-gray-400">
                                            <span>{new Date(req.created_at).toLocaleDateString()}</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                            <span className={`${req.priority === 'High' ? 'text-red-500' : 'text-gray-400'}`}>{req.priority} Priority</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {requests.length === 0 && (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-50">
                                    <CheckCircle2 size={32} className="text-green-500"/>
                                </div>
                                <h3 className="text-gray-900 font-bold text-sm">Everything Looks Good!</h3>
                                <p className="text-gray-400 text-xs mt-1">No active maintenance issues reported.</p>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                // --- WIZARD UI ---
                <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-gray-100 min-h-[500px] flex flex-col animate-in slide-in-from-bottom duration-300">
                    <div className="flex justify-between items-center mb-6">
                        <button onClick={() => { if(wizardStep > 1) setWizardStep(1); else setIsWizardOpen(false); }} className="p-2 hover:bg-gray-100 rounded-full">
                            <ArrowRight size={20} className="rotate-180"/>
                        </button>
                        <h3 className="font-bold text-lg">
                            {wizardStep === 1 ? 'Select Category' : 'Issue Details'}
                        </h3>
                        <button onClick={() => setIsWizardOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20}/></button>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar pb-4">
                        {wizardStep === 1 && (
                            <div className="grid grid-cols-2 gap-3">
                                {ISSUE_CATEGORIES.map(cat => (
                                    <button 
                                        key={cat.id}
                                        onClick={() => { setNewIssue({...newIssue, category: cat.id as any}); setWizardStep(2); }}
                                        className="p-4 rounded-2xl border border-gray-100 hover:border-[#ff4b9a] hover:bg-pink-50 transition-all flex flex-col items-center gap-3 group text-center"
                                    >
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform ${cat.bg} ${cat.color}`}>
                                            <cat.icon size={24}/>
                                        </div>
                                        <span className="text-xs font-bold text-gray-700 group-hover:text-[#ff4b9a]">{cat.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {wizardStep === 2 && (
                            <div className="space-y-6">
                                {/* Common Issues Pills */}
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase mb-3 block">Common Issues</label>
                                    <div className="flex flex-wrap gap-2">
                                        {ISSUE_CATEGORIES.find(c => c.id === newIssue.category)?.sub.map(sub => (
                                            <button 
                                                key={sub}
                                                onClick={() => setNewIssue({...newIssue, subCategory: sub, title: sub})}
                                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${newIssue.subCategory === sub ? 'bg-[#2d1b4e] text-white border-[#2d1b4e]' : 'bg-gray-50 text-gray-600 border-gray-200'}`}
                                            >
                                                {sub}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Description</label>
                                    <textarea 
                                        rows={3}
                                        value={newIssue.description}
                                        onChange={e => setNewIssue({...newIssue, description: e.target.value})}
                                        className="w-full p-4 bg-gray-50 rounded-xl text-sm font-bold border-transparent focus:bg-white focus:border-[#ff4b9a] outline-none transition-all"
                                        placeholder="Describe the problem..."
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Urgency</label>
                                    <div className="flex bg-gray-100 p-1 rounded-xl">
                                        {['Low', 'Medium', 'High'].map(p => (
                                            <button 
                                                key={p}
                                                onClick={() => setNewIssue({...newIssue, priority: p as any})}
                                                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${newIssue.priority === p ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 gap-2 cursor-pointer hover:border-[#ff4b9a] hover:text-[#ff4b9a] transition-all">
                                    <Camera size={24}/>
                                    <span className="text-xs font-bold">Add Photos</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {wizardStep === 2 && (
                        <button onClick={submitIssue} className="w-full py-4 bg-[#2d1b4e] text-white font-bold rounded-xl shadow-lg hover:bg-[#3a2366] active:scale-95 transition-all mt-4">
                            Submit Request
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default Maintenance;
