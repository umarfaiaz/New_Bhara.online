
import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, Users, Wallet, AlertCircle, 
  ArrowRight, CheckCircle2, Clock, Plus, Filter, ArrowUpRight, BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DataService, UserService } from '../../services/mockData';
import { useLanguage } from '../../contexts/LanguageContext';

const Overview: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const currentUser = UserService.getCurrentUser();
  const [stats, setStats] = useState(DataService.getStats());
  const [bills, setBills] = useState(DataService.getBills());

  useEffect(() => {
    const load = () => {
        setStats(DataService.getStats());
        setBills(DataService.getBills());
    };
    load();
    const interval = setInterval(load, 5000); 
    return () => clearInterval(interval);
  }, []);

  const totalPossible = stats.totalCollected + stats.totalPending;
  const collectionRate = totalPossible > 0 ? Math.round((stats.totalCollected / totalPossible) * 100) : 0;
  
  // Actionable Items Logic
  const overdueBills = bills.filter(b => b.status === 'unpaid' || b.status === 'partial');
  const pendingMaintenance = DataService.getMaintenanceRequests('t1').filter(m => m.status === 'Open'); 

  // Asset Occupancy Calc
  const totalAssets = stats.totalFlats + stats.totalVehicles + stats.totalGadgets;
  const occupiedAssets = stats.occupiedFlats + stats.rentedVehicles + stats.rentedGadgets;
  const occupancyRate = totalAssets > 0 ? Math.round((occupiedAssets / totalAssets) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto p-5 space-y-6 animate-in fade-in duration-500 pb-32">
      
      {/* 1. Header Section */}
      <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Good Morning, {currentUser.name.split(' ')[0]}</h1>
          <p className="text-xs text-gray-500">Here's what's happening today.</p>
      </div>

      {/* 2. Compact Stats Row (High Density) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Collected</p>
              <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-gray-900">৳ {(stats.totalCollected / 1000).toFixed(1)}k</h2>
                  <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded flex items-center gap-0.5"><TrendingUp size={10}/> {collectionRate}%</span>
              </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Pending Due</p>
              <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-gray-900">৳ {(stats.totalPending / 1000).toFixed(1)}k</h2>
                  {overdueBills.length > 0 && <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">{overdueBills.length} Bills</span>}
              </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Occupancy</p>
              <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-gray-900">{occupancyRate}%</h2>
                  <span className="text-[10px] text-gray-400 font-medium">{occupiedAssets}/{totalAssets}</span>
              </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Requests</p>
              <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-gray-900">{pendingMaintenance.length}</h2>
                  {pendingMaintenance.length > 0 ? <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span> : <CheckCircle2 size={14} className="text-green-500"/>}
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left: Financials & Quick Actions */}
          <div className="lg:col-span-2 space-y-6">
              
              {/* Financial Chart Area */}
              <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-gray-900 text-sm">Revenue Flow</h3>
                      <button onClick={() => navigate('/myspace/payments')} className="p-1.5 bg-gray-50 rounded-lg text-gray-500 hover:bg-gray-100"><ArrowUpRight size={16}/></button>
                  </div>
                  {/* Simplified Bar Chart */}
                  <div className="h-32 flex items-end gap-3 px-2">
                      {[40, 65, 50, 80, 55, 70, 90].map((h, i) => (
                          <div key={i} className="flex-1 bg-gray-50 rounded-t-lg relative group h-full flex flex-col justify-end">
                              <div 
                                className={`w-full rounded-t-lg transition-all duration-700 ${i === 6 ? 'bg-[#ff4b9a]' : 'bg-[#2d1b4e]'}`} 
                                style={{ height: `${h}%` }}
                              ></div>
                          </div>
                      ))}
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400 font-bold mt-2 px-1">
                      <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                  </div>
              </div>

              {/* Quick Actions Bar */}
              <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 px-1">Quick Actions</h3>
                  <div className="flex gap-3 overflow-x-auto scrollbar-hide">
                      <button onClick={() => navigate('/myspace/assets/select-type')} className="flex items-center gap-2 px-4 py-3 bg-[#2d1b4e] text-white rounded-xl shadow-lg active:scale-95 transition-transform shrink-0">
                          <Plus size={16}/> <span className="text-xs font-bold">Add Asset</span>
                      </button>
                      <button onClick={() => navigate('/myspace/renters')} className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-100 text-gray-700 rounded-xl shadow-sm active:scale-95 transition-transform shrink-0 hover:bg-gray-50">
                          <Users size={16}/> <span className="text-xs font-bold">Add Renter</span>
                      </button>
                      <button onClick={() => navigate('/myspace/payments')} className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-100 text-gray-700 rounded-xl shadow-sm active:scale-95 transition-transform shrink-0 hover:bg-gray-50">
                          <Wallet size={16}/> <span className="text-xs font-bold">Create Bill</span>
                      </button>
                  </div>
              </div>
          </div>

          {/* Right: Priority Feed */}
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm h-fit">
              <h3 className="font-bold text-gray-900 mb-4 text-sm flex items-center gap-2">
                  <AlertCircle size={16} className="text-[#ff4b9a]"/> Priority Feed
              </h3>
              
              <div className="space-y-3">
                  {overdueBills.slice(0, 3).map(bill => (
                      <div key={bill.id} className="flex items-center justify-between p-3 bg-red-50/50 rounded-xl border border-red-50">
                          <div>
                              <p className="text-xs font-bold text-gray-900">{bill.tenant_name}</p>
                              <p className="text-[10px] text-red-500 font-bold">Overdue: ৳ {bill.total}</p>
                          </div>
                          <button onClick={() => navigate('/myspace/payments')} className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-red-500 shadow-sm hover:scale-105 transition-transform">
                              <ArrowRight size={14}/>
                          </button>
                      </div>
                  ))}
                  
                  {pendingMaintenance.map(req => (
                      <div key={req.id} className="flex items-center justify-between p-3 bg-orange-50/50 rounded-xl border border-orange-50">
                          <div>
                              <p className="text-xs font-bold text-gray-900">{req.title}</p>
                              <p className="text-[10px] text-orange-500 font-bold">{req.priority} Priority</p>
                          </div>
                          <button onClick={() => navigate('/myspace/issues')} className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-orange-500 shadow-sm hover:scale-105 transition-transform">
                              <Clock size={14}/>
                          </button>
                      </div>
                  ))}

                  {overdueBills.length === 0 && pendingMaintenance.length === 0 && (
                      <div className="text-center py-8">
                          <CheckCircle2 size={32} className="text-green-500 mx-auto mb-2 opacity-50"/>
                          <p className="text-xs text-gray-500">All tasks completed.</p>
                      </div>
                  )}
              </div>
          </div>
      </div>
    </div>
  );
};

export default Overview;
