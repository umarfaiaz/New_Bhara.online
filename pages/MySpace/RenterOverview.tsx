
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, Zap, CreditCard, Wrench, AlertTriangle, ArrowRight, MessageCircle, 
  Calendar, Car, Camera, Briefcase, Plus, Clock, CheckCircle2, 
  FileText, Bell, ChevronRight, Droplets, Flame, Wifi, Activity
} from 'lucide-react';
import { DataService, UserService } from '../../services/mockData';
import { Bill, MaintenanceRequest } from '../../types';

const RenterOverview: React.FC = () => {
    const navigate = useNavigate();
    const currentUser = UserService.getCurrentUser();
    
    // Data Loading
    const [activeRentals] = useState(DataService.getMyRentals());
    const [bills] = useState(DataService.getBills().filter(b => b.tenant_id === 't1')); // Mock ID t1
    const [issues] = useState(DataService.getMaintenanceRequests('t1'));

    // Financial Calcs (Unified across all rentals)
    const unpaidBills = bills.filter(b => b.status !== 'paid');
    const totalDue = unpaidBills.reduce((acc, curr) => acc + curr.total, 0);
    const rentDue = unpaidBills.reduce((acc, curr) => acc + curr.rent_amount, 0);
    const utilityDue = unpaidBills.reduce((acc, curr) => acc + (curr.total - curr.rent_amount), 0);
    
    // Activity Feed Construction (Merge Bills & Issues)
    const activities = [
        ...bills.map(b => ({ 
            type: 'bill', 
            date: new Date(b.month), 
            title: b.status === 'paid' ? 'Payment Successful' : 'Invoice Generated',
            subtitle: b.asset_name,
            amount: b.total,
            status: b.status,
            id: b.id
        })),
        ...issues.map(i => ({
            type: 'issue',
            date: new Date(i.created_at),
            title: 'Issue Reported',
            subtitle: i.title,
            status: i.status,
            id: i.id
        }))
    ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);

    return (
        <div className="min-h-screen bg-gray-50/50 pb-32 animate-in fade-in duration-500">
            
            {/* 1. Modern Header */}
            <div className="bg-white px-6 pt-6 pb-4 border-b border-gray-100 sticky top-0 z-20">
                <div className="flex justify-between items-center max-w-lg mx-auto md:max-w-none">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 p-0.5 border border-gray-200">
                            <img src={currentUser.avatar || "https://i.pravatar.cc/150?u=u1"} alt="Profile" className="w-full h-full rounded-full object-cover"/>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Welcome Back</p>
                            <h1 className="text-lg font-black text-gray-900 leading-none">{currentUser.name.split(' ')[0]}</h1>
                        </div>
                    </div>
                    <button className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-full relative transition-colors text-gray-600">
                        <Bell size={20}/>
                        <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    </button>
                </div>
            </div>

            <div className="p-6 max-w-lg mx-auto md:max-w-4xl space-y-8">
                
                {/* 2. Hero Financial Card */}
                <div className={`relative rounded-[2rem] p-6 text-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] overflow-hidden transition-all duration-500 group ${totalDue > 0 ? 'bg-gradient-to-br from-[#2d1b4e] to-[#1a102e]' : 'bg-gradient-to-br from-emerald-600 to-teal-700'}`}>
                    
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>

                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <div className="bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2">
                                {totalDue > 0 ? <AlertTriangle size={14} className="text-yellow-400"/> : <CheckCircle2 size={14} className="text-emerald-300"/>}
                                <span className="text-[10px] font-bold uppercase tracking-wider">{totalDue > 0 ? 'Payment Due' : 'All Settled'}</span>
                            </div>
                            <CreditCard size={24} className="opacity-50"/>
                        </div>

                        <div className="mb-8">
                            <p className="text-white/60 text-xs font-bold uppercase mb-1">Total Payable</p>
                            <h2 className="text-4xl sm:text-5xl font-black tracking-tight flex items-baseline gap-1">
                                <span className="text-2xl opacity-60">৳</span> {totalDue.toLocaleString()}
                            </h2>
                            {totalDue > 0 && (
                                <p className="text-xs text-white/50 mt-2 font-medium flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span> Due by 05 {new Date().toLocaleString('default', { month: 'long' })}
                                </p>
                            )}
                        </div>

                        {totalDue > 0 ? (
                            <div className="space-y-4">
                                {/* Breakdown Mini Bar */}
                                <div className="flex gap-1 h-1.5 w-full rounded-full overflow-hidden bg-black/20">
                                    <div className="bg-[#ff4b9a]" style={{ width: `${(rentDue/totalDue)*100}%` }}></div>
                                    <div className="bg-blue-400" style={{ width: `${(utilityDue/totalDue)*100}%` }}></div>
                                </div>
                                <div className="flex justify-between text-[10px] font-bold text-white/70 uppercase px-1">
                                    <span className="flex items-center gap-1"><div className="w-2 h-2 bg-[#ff4b9a] rounded-full"></div> Rent ৳{rentDue/1000}k</span>
                                    <span className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-400 rounded-full"></div> Bills ৳{utilityDue/1000}k</span>
                                </div>

                                <button onClick={() => navigate('/myspace/payments')} className="w-full py-4 bg-white text-[#2d1b4e] font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-gray-50 active:scale-95 transition-all mt-4">
                                    Pay Now <ArrowRight size={18}/>
                                </button>
                            </div>
                        ) : (
                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 flex items-center gap-4">
                                <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-300">
                                    <CheckCircle2 size={20}/>
                                </div>
                                <div>
                                    <p className="font-bold text-sm">You are all caught up!</p>
                                    <p className="text-xs text-white/60">No pending bills for this month.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. Quick Actions */}
                <div className="grid grid-cols-4 gap-2 sm:gap-4">
                    {[
                        { icon: Zap, label: 'Pay', color: 'text-yellow-600', bg: 'bg-yellow-50', action: () => navigate('/myspace/payments') },
                        { icon: MessageCircle, label: 'Chat', color: 'text-purple-600', bg: 'bg-purple-50', action: () => navigate('/inbox') },
                        { icon: Wrench, label: 'Fix', color: 'text-orange-600', bg: 'bg-orange-50', action: () => navigate('/myspace/issues') },
                        { icon: FileText, label: 'Docs', color: 'text-blue-600', bg: 'bg-blue-50', action: () => navigate('/myspace/my-rental') },
                    ].map((item, i) => (
                        <button key={i} onClick={item.action} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all active:scale-95 group">
                            <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                                <item.icon size={22} className={item.color} strokeWidth={2.5}/>
                            </div>
                            <span className="text-xs font-bold text-gray-700">{item.label}</span>
                        </button>
                    ))}
                </div>

                {/* 4. Active Rentals (Horizontal Scroll for Multiple) */}
                {activeRentals.length > 0 && (
                    <div>
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide mb-4 px-2">
                            My Active Rentals ({activeRentals.length})
                        </h3>
                        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x">
                            {activeRentals.map((rental) => (
                                <div key={rental.id} className="min-w-[85%] sm:min-w-[300px] snap-center bg-white rounded-[2rem] p-2 shadow-sm border border-gray-100">
                                    <div className="relative h-40 rounded-[1.5rem] overflow-hidden group cursor-pointer" onClick={() => navigate('/myspace/my-rental')}>
                                        <img 
                                            src={rental.asset_type === 'Vehicle' ? "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800" : "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800"} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
                                        <div className="absolute bottom-4 left-4 text-white">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border border-white/20">
                                                    {rental.asset_type}
                                                </span>
                                                <span className="flex items-center gap-1 text-[10px] font-bold bg-green-500 text-white px-2 py-0.5 rounded-md">
                                                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div> Active
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-bold">{rental.asset_info?.name}</h3>
                                            <p className="text-xs text-white/80">{rental.asset_info?.sub_text}</p>
                                        </div>
                                        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white hover:text-black transition-all">
                                            <ChevronRight size={18}/>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 5. Unified Activity Timeline */}
                <div>
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide mb-4 px-2 flex items-center gap-2">
                        <Activity size={16} className="text-[#ff4b9a]"/> Recent Activity
                    </h3>
                    <div className="space-y-4 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-gray-100">
                        {activities.map((item, i) => (
                            <div key={i} className="relative pl-14 group">
                                <div className={`absolute left-3 top-1 w-6 h-6 rounded-full border-4 border-gray-50 flex items-center justify-center z-10 ${item.type === 'bill' && item.status === 'paid' ? 'bg-green-500' : item.type === 'bill' ? 'bg-[#ff4b9a]' : 'bg-orange-500'}`}></div>
                                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center transition-all hover:shadow-md hover:border-gray-200">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">{item.date.toLocaleDateString()}</p>
                                        <h4 className="font-bold text-sm text-gray-900">{item.title}</h4>
                                        <p className="text-xs text-gray-500">{item.subtitle}</p>
                                    </div>
                                    <div className="text-right">
                                        {item.type === 'bill' && (
                                            <>
                                                <p className="font-black text-gray-900 text-sm">৳{item.amount?.toLocaleString()}</p>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${item.status === 'paid' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                                    {item.status}
                                                </span>
                                            </>
                                        )}
                                        {item.type === 'issue' && (
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${item.status === 'Resolved' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                                                {item.status}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 6. Notices Banner */}
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3 items-start">
                    <div className="bg-blue-100 text-blue-600 p-2 rounded-full shrink-0">
                        <Droplets size={18}/>
                    </div>
                    <div>
                        <h4 className="font-bold text-blue-900 text-sm">Water Tank Maintenance</h4>
                        <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                            Scheduled cleaning tomorrow (10 AM - 2 PM). Water supply might be interrupted.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default RenterOverview;
