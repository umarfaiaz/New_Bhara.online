
import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, Users, Wallet, AlertCircle, 
  ArrowRight, CheckCircle2, Clock, Plus, Filter, ArrowUpRight, BarChart3, PieChart, Sparkles, Wrench, DollarSign, Coins, ArrowDownRight
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
  const totalAssets = stats.totalFlats + stats.totalVehicles + stats.totalGadgets + stats.totalServices;
  const occupiedAssets = stats.occupiedFlats + stats.rentedVehicles + stats.rentedGadgets + stats.bookedServices;
  const occupancyRate = totalAssets > 0 ? Math.round((occupiedAssets / totalAssets) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 animate-in fade-in duration-500 pb-32">
      
      {/* 1. Header */}
      <div className="flex items-center justify-between">
          <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">{t('dash_title')}</h1>
              <p className="text-xs text-gray-500 font-medium mt-0.5">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
          <button className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200">
              <Filter size={18}/>
          </button>
      </div>

      {/* 2. Primary Financial Card (Total Potential) */}
      <div className="bg-[#2d1b4e] text-white p-6 rounded-3xl shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-[#ff4b9a]/20 transition-colors"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div>
                  <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-1">{t('dash_potential')}</p>
                  <h2 className="text-4xl sm:text-5xl font-black tracking-tight flex items-baseline gap-1">
                      <span className="text-2xl opacity-60">৳</span> {(totalPossible / 1000).toFixed(1)}k
                  </h2>
                  <p className="text-xs text-white/50 mt-2 font-medium">Expected revenue for this month</p>
              </div>
              
              {/* Collection Progress */}
              <div className="w-full md:w-auto bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-sm min-w-[200px]">
                  <div className="flex justify-between text-xs font-bold mb-2">
                      <span className="text-white/80">{t('dash_collected')}</span>
                      <span className="text-[#ff4b9a]">{collectionRate}%</span>
                  </div>
                  <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#ff4b9a] h-full transition-all duration-1000" style={{ width: `${collectionRate}%` }}></div>
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] font-medium text-white/50">
                      <span>৳{(stats.totalCollected/1000).toFixed(1)}k</span>
                      <span>Target: ৳{(totalPossible/1000).toFixed(1)}k</span>
                  </div>
              </div>
          </div>
      </div>

      {/* 3. Secondary Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Pending Due */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-red-200 transition-colors group">
              <div className="flex justify-between items-start mb-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t('dash_pending')}</p>
                  <AlertCircle size={16} className="text-gray-300 group-hover:text-red-500 transition-colors"/>
              </div>
              <h2 className="text-2xl font-black text-gray-900">৳{(stats.totalPending / 1000).toFixed(1)}k</h2>
              <p className="text-[10px] text-red-500 mt-1 font-bold bg-red-50 inline-block px-1.5 py-0.5 rounded">{overdueBills.length} Unpaid</p>
          </div>

          {/* Occupancy */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-200 transition-colors group">
              <div className="flex justify-between items-start mb-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t('dash_occupancy')}</p>
                  <PieChart size={16} className="text-gray-300 group-hover:text-blue-500 transition-colors"/>
              </div>
              <h2 className="text-2xl font-black text-gray-900">{occupancyRate}%</h2>
              <p className="text-[10px] text-gray-500 mt-1 font-medium">{occupiedAssets}/{totalAssets} Units</p>
          </div>

          {/* Net Income (Projected) */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-green-200 transition-colors group">
              <div className="flex justify-between items-start mb-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t('dash_net_income')}</p>
                  <Wallet size={16} className="text-gray-300 group-hover:text-green-500 transition-colors"/>
              </div>
              <h2 className="text-2xl font-black text-gray-900">৳{(stats.totalCollected / 1000).toFixed(1)}k</h2>
              <p className="text-[10px] text-green-600 mt-1 font-bold">Cash in Hand</p>
          </div>

          {/* Expenses (Mock) */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-orange-200 transition-colors group">
              <div className="flex justify-between items-start mb-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t('dash_expense')}</p>
                  <ArrowDownRight size={16} className="text-gray-300 group-hover:text-orange-500 transition-colors"/>
              </div>
              <h2 className="text-2xl font-black text-gray-900">৳12.5k</h2>
              <p className="text-[10px] text-gray-500 mt-1 font-medium">Maintenance & Utils</p>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feed: Priority Actions */}
          <div className="lg:col-span-2 space-y-6">
              {/* Quick Actions Bar */}
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center gap-2 overflow-x-auto">
                  {[
                      { label: t('ms_add_asset'), icon: Plus, action: () => navigate('/myspace/rentals') },
                      { label: t('ms_new_renter'), icon: Users, action: () => navigate('/myspace/rentals') },
                      { label: t('ms_payments'), icon: Wallet, action: () => navigate('/myspace/payments') },
                      { label: 'Analytics', icon: BarChart3, action: () => {} },
                  ].map((action, i) => (
                      <button key={i} onClick={action.action} className="flex flex-col items-center gap-2 min-w-[80px] group">
                          <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-600 group-hover:bg-[#2d1b4e] group-hover:text-white transition-all shadow-sm">
                              <action.icon size={20}/>
                          </div>
                          <span className="text-[10px] font-bold text-gray-500 group-hover:text-gray-900 text-center leading-tight">{action.label}</span>
                      </button>
                  ))}
              </div>

              {/* Priority Feed */}
              <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Sparkles size={16} className="text-[#ff4b9a]"/> Priority Feed
                  </h3>
                  
                  <div className="space-y-3">
                      {overdueBills.length === 0 && pendingMaintenance.length === 0 ? (
                          <div className="bg-green-50 border border-green-100 rounded-2xl p-8 text-center">
                              <CheckCircle2 size={32} className="text-green-500 mx-auto mb-2"/>
                              <h4 className="text-green-800 font-bold text-sm">All Clear!</h4>
                              <p className="text-green-600 text-xs mt-1">No pending tasks or overdue payments.</p>
                          </div>
                      ) : (
                          <>
                              {overdueBills.slice(0, 3).map(bill => (
                                  <div key={bill.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-l-4 border-l-red-500 border-gray-100 shadow-sm hover:shadow-md transition-all">
                                      <div className="flex items-center gap-3">
                                          <div className="w-10 h-10 bg-red-50 text-red-500 rounded-full flex items-center justify-center shrink-0">
                                              <Wallet size={18}/>
                                          </div>
                                          <div>
                                              <h4 className="font-bold text-sm text-gray-900">{bill.tenant_name}</h4>
                                              <p className="text-xs text-red-500 font-bold">Overdue: ৳{bill.total.toLocaleString()}</p>
                                          </div>
                                      </div>
                                      <button onClick={() => navigate('/myspace/payments')} className="px-3 py-1.5 bg-gray-50 text-gray-600 text-xs font-bold rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors">
                                          Collect
                                      </button>
                                  </div>
                              ))}
                              {pendingMaintenance.map(req => (
                                  <div key={req.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-l-4 border-l-orange-500 border-gray-100 shadow-sm hover:shadow-md transition-all">
                                      <div className="flex items-center gap-3">
                                          <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center shrink-0">
                                              <Wrench size={18}/>
                                          </div>
                                          <div>
                                              <h4 className="font-bold text-sm text-gray-900">{req.title}</h4>
                                              <p className="text-xs text-orange-500 font-bold">{req.priority} Priority</p>
                                          </div>
                                      </div>
                                      <button onClick={() => navigate('/myspace/issues')} className="px-3 py-1.5 bg-gray-50 text-gray-600 text-xs font-bold rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-colors">
                                          Resolve
                                      </button>
                                  </div>
                              ))}
                          </>
                      )}
                  </div>
              </div>
          </div>

          {/* Right Column: Financial Breakdown (Replaced Weekly Trend) */}
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm h-fit">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-gray-900 text-sm">Income Breakdown</h3>
                  <button className="text-gray-400 hover:text-gray-600"><ArrowUpRight size={16}/></button>
              </div>
              
              <div className="space-y-4">
                  {/* Item 1 */}
                  <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-gray-500">Rent</span>
                          <span className="text-gray-900">৳120k</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-[#2d1b4e] h-full w-[80%]"></div>
                      </div>
                  </div>
                  {/* Item 2 */}
                  <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-gray-500">Service Charges</span>
                          <span className="text-gray-900">৳15k</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-purple-500 h-full w-[10%]"></div>
                      </div>
                  </div>
                  {/* Item 3 */}
                  <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-gray-500">Utilities</span>
                          <span className="text-gray-900">৳15k</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-blue-400 h-full w-[10%]"></div>
                      </div>
                  </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-50 flex gap-4">
                  <div className="flex-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">This Month</p>
                      <p className="text-lg font-black text-gray-900">৳150k</p>
                  </div>
                  <div className="flex-1 border-l border-gray-100 pl-4">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Last Month</p>
                      <p className="text-lg font-black text-gray-400">৳142k</p>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default Overview;
