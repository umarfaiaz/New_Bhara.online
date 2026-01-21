
import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, TrendingDown, Users, Wallet, AlertCircle, 
  ArrowRight, MoreHorizontal, Calendar, ArrowUpRight, 
  CheckCircle2, Clock, Plus, Zap, Filter, PieChart, Activity, DollarSign, FileText
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

  // Chart Data Simulation (Last 6 Months)
  const chartData = [
      { month: 'May', income: 45, expected: 50 },
      { month: 'Jun', income: 52, expected: 55 },
      { month: 'Jul', income: 48, expected: 55 },
      { month: 'Aug', income: 60, expected: 60 },
      { month: 'Sep', income: 55, expected: 62 },
      { month: 'Oct', income: stats.totalCollected / 1000, expected: totalPossible / 1000 }, // Current
  ];
  const maxVal = Math.max(...chartData.map(d => d.expected));

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in duration-500 pb-32">
      
      {/* 1. Header Section */}
      <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Good Morning, {currentUser.name.split(' ')[0]}</h1>
          <p className="text-sm text-gray-500">Here's what's happening with your properties today.</p>
      </div>

      {/* 2. Top Stats Cards (Refined) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Collected */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between h-40 relative overflow-hidden group hover:border-[#ff4b9a]/30 transition-colors">
              <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Wallet size={80} className="text-[#ff4b9a]" />
              </div>
              <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Collected (This Month)</p>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">৳ {(stats.totalCollected / 1000).toFixed(1)}k</h2>
              </div>
              <div>
                  <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{collectionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#ff4b9a] h-full rounded-full transition-all duration-1000" style={{ width: `${collectionRate}%` }}></div>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2">Target: ৳ {(totalPossible/1000).toFixed(1)}k</p>
              </div>
          </div>

          {/* Card 2: Pending */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between h-40 relative overflow-hidden group hover:border-orange-200 transition-colors">
               <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                  <AlertCircle size={80} className="text-orange-500" />
              </div>
              <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Pending Dues</p>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">৳ {(stats.totalPending / 1000).toFixed(1)}k</h2>
              </div>
              <div className="flex items-center gap-3">
                  <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-lg text-xs font-bold">
                      {overdueBills.length} Invoices
                  </span>
                  <button onClick={() => navigate('/myspace/payments')} className="text-xs font-bold text-gray-500 hover:text-gray-900 underline decoration-gray-300">View All</button>
              </div>
          </div>

          {/* Card 3: Occupancy */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between h-40 relative overflow-hidden group hover:border-blue-200 transition-colors">
              <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Occupancy Rate</p>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">{occupancyRate}%</h2>
                  <p className="text-[10px] text-gray-400 mt-1">{occupiedAssets} of {totalAssets} Assets Rented</p>
              </div>
              {/* Simple Circular Chart CSS */}
              <div className="relative w-20 h-20">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path
                          className="text-gray-100"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                      />
                      <path
                          className="text-blue-500 transition-all duration-1000 ease-out"
                          strokeDasharray={`${occupancyRate}, 100`}
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                      />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-blue-500">
                      <Users size={20} />
                  </div>
              </div>
          </div>
      </div>

      {/* 3. Main Dashboard Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
              
              {/* Financial Chart */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-gray-900">Revenue Performance</h3>
                      <div className="flex gap-4">
                          <div className="flex items-center gap-1.5">
                              <div className="w-2.5 h-2.5 bg-[#2d1b4e] rounded-full"></div>
                              <span className="text-[10px] font-bold text-gray-500">Collected</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                              <div className="w-2.5 h-2.5 bg-gray-200 rounded-full"></div>
                              <span className="text-[10px] font-bold text-gray-500">Expected</span>
                          </div>
                      </div>
                  </div>
                  
                  <div className="h-48 flex items-end justify-between gap-4 sm:gap-8 px-2">
                      {chartData.map((d, i) => (
                          <div key={i} className="flex-1 flex flex-col justify-end gap-1 relative group">
                              {/* Tooltip */}
                              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                  ৳ {d.income}k / {d.expected}k
                              </div>
                              
                              <div className="w-full bg-gray-100 rounded-t-sm relative h-full flex flex-col justify-end" style={{ height: `${(d.expected / maxVal) * 100}%` }}>
                                  <div 
                                    className="w-full bg-[#2d1b4e] rounded-t-sm transition-all duration-700 ease-out" 
                                    style={{ height: `${(d.income / d.expected) * 100}%` }}
                                  ></div>
                              </div>
                              <span className="text-[10px] text-gray-400 font-bold text-center mt-2 uppercase">{d.month}</span>
                          </div>
                      ))}
                  </div>
              </div>

              {/* Priority Actions */}
              <div>
                  <h3 className="font-bold text-gray-900 mb-4 px-1">Priority Actions</h3>
                  <div className="space-y-3">
                      {overdueBills.slice(0, 3).map(bill => (
                          <div key={bill.id} className="bg-white p-4 rounded-2xl border border-red-50 shadow-sm flex items-center justify-between group hover:border-red-200 transition-colors">
                              <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 bg-red-50 text-red-500 rounded-full flex items-center justify-center font-bold">!</div>
                                  <div>
                                      <h4 className="font-bold text-gray-900 text-sm">Rent Overdue: {bill.tenant_name}</h4>
                                      <p className="text-xs text-gray-500">{bill.asset_name} • <span className="font-bold text-red-500">৳ {bill.total.toLocaleString()}</span></p>
                                  </div>
                              </div>
                              <button onClick={() => navigate('/myspace/payments')} className="px-4 py-2 bg-red-50 text-red-600 text-xs font-bold rounded-xl hover:bg-red-100 transition-colors">
                                  Review
                              </button>
                          </div>
                      ))}
                      {pendingMaintenance.slice(0, 2).map(req => (
                          <div key={req.id} className="bg-white p-4 rounded-2xl border border-orange-50 shadow-sm flex items-center justify-between group hover:border-orange-200 transition-colors">
                              <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center font-bold"><Clock size={18}/></div>
                                  <div>
                                      <h4 className="font-bold text-gray-900 text-sm">Issue: {req.title}</h4>
                                      <p className="text-xs text-gray-500">{req.asset_name} • {req.priority} Priority</p>
                                  </div>
                              </div>
                              <button onClick={() => navigate('/myspace/issues')} className="px-4 py-2 bg-orange-50 text-orange-600 text-xs font-bold rounded-xl hover:bg-orange-100 transition-colors">
                                  Resolve
                              </button>
                          </div>
                      ))}
                      
                      {overdueBills.length === 0 && pendingMaintenance.length === 0 && (
                          <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center shadow-sm">
                              <CheckCircle2 size={32} className="text-green-500 mx-auto mb-2 opacity-50"/>
                              <p className="text-sm font-bold text-gray-900">All caught up!</p>
                              <p className="text-xs text-gray-500">No urgent tasks requiring attention.</p>
                          </div>
                      )}
                  </div>
              </div>

          </div>

          {/* Right Column (1/3 width) */}
          <div className="space-y-8">
              
              {/* Quick Access */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider text-gray-400">Quick Access</h3>
                  <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => navigate('/myspace/payments')} className="p-4 bg-gray-50 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-gray-100 transition-colors group">
                          <div className="p-2 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform"><Plus size={18} className="text-gray-700"/></div>
                          <span className="text-xs font-bold text-gray-600">Add Bill</span>
                      </button>
                      <button onClick={() => navigate('/myspace/renters')} className="p-4 bg-gray-50 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-gray-100 transition-colors group">
                          <div className="p-2 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform"><Users size={18} className="text-gray-700"/></div>
                          <span className="text-xs font-bold text-gray-600">Add Renter</span>
                      </button>
                      <button onClick={() => navigate('/myspace/inventory')} className="p-4 bg-gray-50 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-gray-100 transition-colors group">
                          <div className="p-2 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform"><Filter size={18} className="text-gray-700"/></div>
                          <span className="text-xs font-bold text-gray-600">Inventory</span>
                      </button>
                      <button onClick={() => navigate('/myspace/payments')} className="p-4 bg-gray-50 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-gray-100 transition-colors group">
                          <div className="p-2 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform"><ArrowUpRight size={18} className="text-gray-700"/></div>
                          <span className="text-xs font-bold text-gray-600">Reports</span>
                      </button>
                  </div>
              </div>

              {/* Vacancy / Upsell */}
              {occupancyRate < 100 && (
                  <div className="bg-gradient-to-br from-[#2d1b4e] to-black p-6 rounded-3xl text-white shadow-lg relative overflow-hidden group cursor-pointer" onClick={() => navigate('/marketplace/post')}>
                      <div className="absolute -right-4 -top-4 bg-white/10 w-24 h-24 rounded-full blur-xl group-hover:bg-[#ff4b9a]/20 transition-colors"></div>
                      <h4 className="font-bold text-lg mb-2 relative z-10">Fill your vacancies</h4>
                      <p className="text-xs text-gray-300 mb-4 relative z-10 leading-relaxed">
                          You have {totalAssets - occupiedAssets} vacant assets. List them on the marketplace to find renters fast.
                      </p>
                      <div className="flex items-center gap-2 text-xs font-bold text-[#ff4b9a] relative z-10">
                          Create Listing <ArrowRight size={14}/>
                      </div>
                  </div>
              )}

              {/* Recent Activity Mini Feed */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider text-gray-400">Activity Log</h3>
                  <div className="space-y-4">
                      {[
                          { title: 'Payment Rec.', desc: '৳ 15k from Flat 4A', time: '2h', icon: CheckCircle2, color: 'text-green-500' },
                          { title: 'New Tenant', desc: 'Rahim assigned to Car', time: '5h', icon: Users, color: 'text-blue-500' },
                          { title: 'Bill Generated', desc: 'Oct Rent for All', time: '1d', icon: FileText, color: 'text-purple-500' } // Importing FileText might be needed or swap icon
                      ].map((act, i) => (
                          <div key={i} className="flex gap-3 items-start">
                              <act.icon size={16} className={`${act.color} mt-0.5 shrink-0`} />
                              <div>
                                  <p className="text-xs font-bold text-gray-900">{act.title}</p>
                                  <p className="text-[10px] text-gray-500">{act.desc}</p>
                              </div>
                              <span className="ml-auto text-[10px] text-gray-400 font-medium">{act.time}</span>
                          </div>
                      ))}
                  </div>
              </div>

          </div>
      </div>
    </div>
  );
};

export default Overview;
