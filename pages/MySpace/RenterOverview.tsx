
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Zap, CreditCard, Wrench, AlertTriangle, ArrowRight, MessageCircle, Calendar, Car, Camera, Briefcase, Plus } from 'lucide-react';
import { DataService } from '../../services/mockData';
import { AssetType } from '../../types';

const RenterOverview: React.FC = () => {
    const navigate = useNavigate();
    // Simulate logged in user is Tenant 't1' (Rafiqul Islam) and his other rental profiles
    const [activeRentals, setActiveRentals] = useState(DataService.getMyRentals());
    const [bills, setBills] = useState(DataService.getBills().filter(b => b.tenant_name === 'Mr. Rafiqul Islam'));

    const unpaidBills = bills.filter(b => b.status === 'unpaid');
    const totalDue = unpaidBills.reduce((acc, curr) => acc + curr.total, 0);

    const getIcon = (type: AssetType) => {
        switch(type) {
            case 'Vehicle': return <Car size={20} className="text-indigo-600"/>;
            case 'Gadget': return <Camera size={20} className="text-orange-600"/>;
            case 'Residential': return <Home size={20} className="text-blue-600"/>;
            default: return <Briefcase size={20} className="text-gray-600"/>;
        }
    };

    const getBgColor = (type: AssetType) => {
        switch(type) {
            case 'Vehicle': return 'bg-indigo-50 border-indigo-100';
            case 'Gadget': return 'bg-orange-50 border-orange-100';
            case 'Residential': return 'bg-blue-50 border-blue-100';
            default: return 'bg-gray-50 border-gray-100';
        }
    };

    return (
        <div className="p-6 space-y-8 pb-32">
            
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Good Morning,</h1>
                    <p className="text-gray-500 text-sm">Rafiqul Islam</p>
                </div>
                <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden border-2 border-white shadow-sm">
                    <img src="https://i.pravatar.cc/150?u=u1" alt="Profile" className="w-full h-full object-cover"/>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. Wallet / Liability Card */}
                <div className={`rounded-3xl p-6 text-white relative overflow-hidden shadow-xl transition-transform active:scale-[0.99] flex flex-col justify-between ${totalDue > 0 ? 'bg-[#ff4b9a]' : 'bg-emerald-600'}`}>
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-white/80 text-xs font-bold uppercase tracking-wider mb-1">
                                    {totalDue > 0 ? 'Total Due Amount' : 'All Cleared'}
                                </p>
                                <h3 className="text-4xl font-extrabold tracking-tight">
                                    ৳ {totalDue.toLocaleString()}
                                </h3>
                            </div>
                            <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm shadow-inner">
                                <CreditCard size={24} className="text-white"/>
                            </div>
                        </div>

                        {totalDue > 0 && (
                            <div className="bg-black/10 rounded-xl p-3 mb-5 border border-white/10 flex justify-between items-center">
                                <span className="text-xs text-white/90 font-medium">{unpaidBills.length} Invoices Pending</span>
                                <span className="text-[10px] bg-white text-[#ff4b9a] px-2 py-0.5 rounded font-bold">DUE NOW</span>
                            </div>
                        )}

                        <button 
                            onClick={() => navigate('/myspace/payments')} 
                            className="w-full bg-white text-gray-900 py-3.5 rounded-xl font-bold text-sm shadow-lg hover:bg-gray-50 flex items-center justify-center gap-2"
                        >
                            {totalDue > 0 ? 'Pay All Now' : 'View Payment History'} <ArrowRight size={16}/>
                        </button>
                    </div>
                </div>

                {/* Right Column Group */}
                <div className="space-y-6">
                    {/* 2. Active Rentals */}
                    <div>
                        <div className="flex justify-between items-center mb-4 px-1">
                            <h3 className="text-sm font-bold text-gray-900">Active Rentals ({activeRentals.length})</h3>
                            <button onClick={() => navigate('/myspace/my-rental')} className="text-xs font-bold text-[#ff4b9a]">View All</button>
                        </div>
                        
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-0">
                            {activeRentals.map((rental, i) => (
                                <div 
                                    key={i} 
                                    onClick={() => navigate('/myspace/my-rental')}
                                    className={`min-w-[200px] flex-1 p-4 rounded-2xl border ${getBgColor(rental.asset_type)} relative group cursor-pointer active:scale-95 transition-transform`}
                                >
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="p-2 bg-white rounded-xl shadow-sm">
                                            {getIcon(rental.asset_type)}
                                        </div>
                                        <span className="bg-white/60 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-bold uppercase text-gray-600">Active</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-1 truncate">{rental.asset_info?.name}</h4>
                                        <p className="text-xs text-gray-500 truncate">{rental.asset_info?.sub_text}</p>
                                    </div>
                                </div>
                            ))}
                             {/* Add New Placeholder */}
                             <div onClick={() => navigate('/marketplace')} className="min-w-[100px] flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 cursor-pointer active:scale-95 transition-transform bg-gray-50">
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                                    <Plus size={16} className="text-gray-500"/>
                                </div>
                                <span className="text-[10px] font-bold text-gray-400">Rent New</span>
                            </div>
                        </div>
                    </div>

                    {/* 3. Quick Actions Grid */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 mb-4 px-1">Services</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => navigate('/myspace/issues')} className="bg-white p-4 rounded-2xl flex items-center gap-3 border border-gray-100 shadow-sm active:scale-95 transition-transform hover:shadow-md">
                                <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center shrink-0">
                                    <Wrench size={20}/>
                                </div>
                                <div className="text-left">
                                    <span className="block text-xs font-bold text-gray-900">Maintenance</span>
                                    <span className="block text-[10px] text-gray-400">Report Issue</span>
                                </div>
                            </button>
                            <button onClick={() => navigate('/inbox')} className="bg-white p-4 rounded-2xl flex items-center gap-3 border border-gray-100 shadow-sm active:scale-95 transition-transform hover:shadow-md">
                                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                                    <MessageCircle size={20}/>
                                </div>
                                <div className="text-left">
                                    <span className="block text-xs font-bold text-gray-900">Support</span>
                                    <span className="block text-[10px] text-gray-400">Chat with Owners</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Active Notices (Mock) */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 flex gap-3">
                <AlertTriangle size={20} className="text-gray-500 mt-0.5 shrink-0"/>
                <div>
                    <h4 className="text-sm font-bold text-gray-900">Maintenance Scheduled</h4>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        Vehicle <span className="font-bold">Toyota Corolla</span> is due for oil change on 15th Oct.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RenterOverview;
